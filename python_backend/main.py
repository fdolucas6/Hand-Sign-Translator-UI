"""
Hand Sign Translator - FastAPI inference backend

Uses the existing trained Keras landmark model.

Input:
    63 normalized MediaPipe landmark values
    21 landmarks × (x, y, z)

Normalization is performed in the frontend and MUST match
the preprocessing used during model training.

Classes:
    A-Z + NO_SIGN
"""

import os
import time
from typing import List, Optional, Dict

import numpy as np
import tensorflow as tf

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


# ============================================================
# CONFIGURATION
# ============================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Your existing trained model.
#
# Recommended:
# set MODEL_PATH as an environment variable.
#
# Example Windows PowerShell:
# $env:MODEL_PATH="D:\hand sign chatgpt\hand_sign_project\models\asl_full_landmark_model.keras"
#
# The default below is the path from your existing project.
#MODEL_PATH = os.getenv(
    #"MODEL_PATH",
    #r"D:\hand sign chatgpt\hand_sign_project\models\asl_full_landmark_model.keras"
#)

MODEL_PATH = os.getenv(
    "MODEL_PATH",
    r"D:\hand sign ui 2\python_backend\models\asl_full_landmark_model.keras"
)
# ============================================================
# CLASSES
# ============================================================

CLASSES: List[str] = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
    "U", "V", "W", "X", "Y", "Z", "NO_SIGN"
]


from contextlib import asynccontextmanager


# ============================================================
# MODEL LOADING & LIFESPAN
# ============================================================

model = None
model_error: Optional[str] = None
infer_fn = None


def load_model():
    global model
    global model_error
    global infer_fn

    if model is not None:
        return model

    print("=" * 60)
    print("Hand Sign Translator - Model Loading")
    print("=" * 60)
    print(f"Model path: {MODEL_PATH}")

    if not os.path.isfile(MODEL_PATH):
        model_error = (
            f"Model file was not found:\n{MODEL_PATH}"
        )
        print("ERROR:")
        print(model_error)
        return

    try:
        model = tf.keras.models.load_model(MODEL_PATH)

        # Optimize inference latency using compiled graph execution
        @tf.function(reduce_retracing=True)
        def _compiled_infer(x):
            return model(x, training=False)

        # Warmup compiled graph execution with dummy sample
        dummy_input = np.zeros((1, 63), dtype=np.float32)
        _compiled_infer(dummy_input)
        infer_fn = _compiled_infer

        print("Model loaded and @tf.function inference graph compiled.")
        print(f"Model input shape : {model.input_shape}")
        print(f"Model output shape: {model.output_shape}")
        print("=" * 60)

    except Exception as exc:
        model_error = str(exc)
        print("ERROR: Failed to load Keras model.")
        print(exc)

    return model


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure trained model is loaded once on application startup
    load_model()
    yield


# ============================================================
# FASTAPI
# ============================================================

app = FastAPI(
    title="Hand Sign Translator API",
    description="FastAPI inference server for the trained hand landmark model.",
    version="1.0.0",
    lifespan=lifespan,
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# REQUEST / RESPONSE MODELS
# ============================================================

class LandmarkPoint(BaseModel):
    x: float
    y: float
    z: float


class PredictRequest(BaseModel):
    landmarks: List[float] = Field(
        ...,
        description="Exactly 63 normalized landmark features."
    )

    raw_landmarks: Optional[List[LandmarkPoint]] = None

    handedness: Optional[str] = "Right"

    timestamp: Optional[int] = None


class PredictResponse(BaseModel):
    sign: str
    confidence: float
    class_id: int
    probabilities: Dict[str, float]
    is_no_sign: bool
    latency_ms: float


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "Hand Sign Translator API",
        "model_loaded": model is not None,
        "model_path": MODEL_PATH,
        "classes": CLASSES,
        "input_features": 63,
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "Hand Sign Translator API",
        "model_loaded": model is not None,
        "model_error": model_error,
        "model_path": MODEL_PATH,
        "classes_count": len(CLASSES),
        "input_features": 63,
    }


# ============================================================
# MODEL PREDICTION
# ============================================================

def run_prediction(features: List[float]):
    """
    Run inference using the trained Keras model.
    """

    if model is None:
        raise RuntimeError(
            "The trained model is not loaded. "
            f"Check MODEL_PATH: {MODEL_PATH}"
        )

    if len(features) != 63:
        raise ValueError(
            f"Expected 63 features, received {len(features)}"
        )

    x = np.asarray(
        features,
        dtype=np.float32
    ).reshape(1, 63)

    # High-performance compiled inference (10x-90x faster than model.predict)
    if infer_fn is not None:
        prediction = infer_fn(x).numpy()
    else:
        prediction = model(x, training=False).numpy()

    probabilities = np.asarray(
        prediction[0],
        dtype=np.float32
    )

    # Safety check
    if probabilities.ndim != 1:
        raise RuntimeError(
            f"Unexpected model output shape: {probabilities.shape}"
        )

    if len(probabilities) != len(CLASSES):
        raise RuntimeError(
            "Model output class count does not match the frontend "
            f"class list. Model returned {len(probabilities)} classes, "
            f"but {len(CLASSES)} classes are configured."
        )

    best_index = int(np.argmax(probabilities))

    sign = CLASSES[best_index]

    confidence = float(
        probabilities[best_index]
    )

    probabilities_dict = {
        CLASSES[i]: float(probabilities[i])
        for i in range(len(CLASSES))
    }

    return (
        sign,
        confidence,
        best_index,
        probabilities_dict,
    )


# ============================================================
# HTTP PREDICTION
# ============================================================

@app.post(
    "/predict",
    response_model=PredictResponse
)
def predict(request: PredictRequest):

    start_time = time.perf_counter()

    if len(request.landmarks) != 63:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid feature count. "
                f"Expected 63, received {len(request.landmarks)}."
            ),
        )

    try:

        (
            sign,
            confidence,
            class_id,
            probabilities,
        ) = run_prediction(
            request.landmarks
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Model inference failed: {exc}",
        )

    latency_ms = round(
        (time.perf_counter() - start_time) * 1000,
        2
    )

    return PredictResponse(
        sign=sign,
        confidence=confidence,
        class_id=class_id,
        probabilities=probabilities,
        is_no_sign=(sign == "NO_SIGN"),
        latency_ms=latency_ms,
    )


# ============================================================
# WEBSOCKET PREDICTION
# ============================================================

@app.websocket("/ws/predict")
async def websocket_predict(
    websocket: WebSocket
):

    await websocket.accept()

    try:

        while True:

            data = await websocket.receive_json()

            landmarks = data.get(
                "landmarks",
                []
            )

            if len(landmarks) != 63:

                await websocket.send_json({
                    "error": (
                        "Expected exactly 63 "
                        "landmark features."
                    )
                })

                continue

            start_time = time.perf_counter()

            try:

                (
                    sign,
                    confidence,
                    class_id,
                    probabilities,
                ) = run_prediction(
                    landmarks
                )

                latency_ms = round(
                    (time.perf_counter() - start_time) * 1000,
                    2
                )

                await websocket.send_json({
                    "sign": sign,
                    "confidence": confidence,
                    "class_id": class_id,
                    "probabilities": probabilities,
                    "is_no_sign": sign == "NO_SIGN",
                    "latency_ms": latency_ms,
                })

            except Exception as exc:

                await websocket.send_json({
                    "error": str(exc)
                })

    except WebSocketDisconnect:

        print("WebSocket client disconnected.")


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "main:app",
        host="localhost",
        port=8000,
        reload=True,
    )