# Python FastAPI Backend for Hand Sign Translator

This backend serves predictions for the React frontend application using your trained machine-learning model (Random Forest, SVM, MLP, ONNX, or PyTorch).

## Quick Start

### 1. Set Up Virtual Environment

```bash
cd python_backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Place Your Model File

Place your trained model (e.g. `model.pkl`) into this folder, or set the environment variable:
```bash
export MODEL_PATH="path/to/your/model.pkl"
```

### 4. Run the Server

```bash
python main.py
# Or via uvicorn directly:
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The server will start on `http://localhost:8000`. The frontend will detect it automatically and display `API: Ready (FastAPI:8000)`.

## API Endpoints

- `GET /health` - Health check status
- `POST /predict` - Accepts 63 normalized coordinates:
  ```json
  {
    "landmarks": [0.0, 0.0, 0.0, ... 63 floats],
    "handedness": "Right"
  }
  ```
  Returns:
  ```json
  {
    "sign": "A",
    "confidence": 0.942,
    "is_no_sign": false,
    "latency_ms": 4.2
  }
  ```
- `WS /ws/predict` - Real-time streaming WebSocket endpoint.
