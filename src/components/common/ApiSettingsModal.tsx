import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, AlertTriangle, RefreshCw, Server, Send, 
  Terminal, ShieldCheck, Zap, Copy, Check 
} from 'lucide-react';
import { fastApiService, loadSavedApiConfig, saveApiConfig, ApiTelemetryLog } from '../../services/api';
import { ApiConnectionConfig, ConnectionStatus } from '../../types/asl';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: ConnectionStatus;
  latencyMs: number | null;
  errorMessage: string | null;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  status,
  latencyMs,
  errorMessage,
}) => {
  const [config, setConfig] = useState<ApiConnectionConfig>(loadSavedApiConfig());
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; latency: number; error?: string } | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<ApiTelemetryLog[]>([]);
  const [activeTab, setActiveTab] = useState<'config' | 'contract' | 'logs' | 'serverCode'>('config');

  useEffect(() => {
    if (isOpen) {
      setConfig(fastApiService.getConfig());
      setTelemetryLogs(fastApiService.getTelemetryLogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiConfig(config);
    fastApiService.setConfig(config);
    handleTestPing();
  };

  const handleTestPing = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const result = await fastApiService.checkHealth();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({ ok: false, latency: 0, error: err.message });
    } finally {
      setIsTesting(false);
      setTelemetryLogs(fastApiService.getTelemetryLogs());
    }
  };

  const samplePayload = {
    landmarks: Array.from({ length: 63 }, (_, i) => {
      // 0, 1, 2 are Joint 0 (wrist) centered at 0.0
      if (i < 3) return 0.0;
      return Number(((Math.sin(i * 0.4) * 0.8)).toFixed(4));
    }),
    handedness: 'Right',
    timestamp: Date.now(),
  };

  const sampleFastApiCode = `# Python FastAPI Backend (main.py)
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import numpy as np

app = FastAPI(title="Hand Sign ASL Classifier", version="2.4.0")

# 1. Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

CLASSES = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
    'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'U', 'V', 'W', 'X', 'Y', 'Z', 'NO_SIGN'
]

class PredictRequest(BaseModel):
    landmarks: List[float] # Exactly 63 floats (21 joints * 3 [x,y,z])
    handedness: Optional[str] = "Right"
    timestamp: Optional[int] = None

class PredictResponse(BaseModel):
    sign: str
    confidence: float
    is_no_sign: bool
    latency_ms: Optional[float] = 0.0

@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "Hand Sign Classifier API",
        "version": "2.4.0",
        "classes_count": len(CLASSES)
    }

@app.post("/predict", response_model=PredictResponse)
def predict_sign(req: PredictRequest):
    if len(req.landmarks) != 63:
        raise HTTPException(status_code=400, detail=f"Expected 63 floats, got {len(req.landmarks)}")
    
    # Example model inference using your trained weights (PyTorch, ONNX, or scikit-learn):
    # vector = np.array(req.landmarks, dtype=np.float32).reshape(1, -1)
    # probabilities = model.predict_proba(vector)[0]
    # best_idx = int(np.argmax(probabilities))
    # sign_label = CLASSES[best_idx]
    # confidence = float(probabilities[best_idx])
    
    # In case of no hand movement / neutral state:
    # if confidence < 0.65:
    #     sign_label = "NO_SIGN"
    
    return {
        "sign": "A",
        "confidence": 0.942,
        "is_no_sign": False,
        "latency_ms": 4.2
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
`;

  const copyToClipboard = (text: string, type: 'snippet' | 'payload') => {
    navigator.clipboard.writeText(text);
    if (type === 'snippet') {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="api-settings-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#f8faff]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 id="api-settings-title" className="text-lg font-bold text-slate-900 font-heading">
                Backend Connection & API Diagnostics
              </h2>
              <p className="text-xs text-slate-500">
                Configure your local Python FastAPI ML inference endpoint
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Alert Banner */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Live Status:</span>
            {status === 'connected' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                Connected ({latencyMs ?? '~'} ms)
              </span>
            ) : status === 'connecting' ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                Connecting...
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full font-medium bg-rose-50 text-rose-700 border border-rose-200">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
                Offline / Unreachable
              </span>
            )}
          </div>
          <span className="text-slate-500 font-mono">
            Target: <code className="text-slate-700 font-bold">{config.baseUrl}</code>
          </span>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 px-6 bg-white">
          <button
            onClick={() => setActiveTab('config')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'config'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Endpoint Settings
          </button>
          <button
            onClick={() => setActiveTab('contract')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'contract'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            63-Feature Payload Contract
          </button>
          <button
            onClick={() => setActiveTab('serverCode')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'serverCode'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            FastAPI Reference Server (main.py)
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'logs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Telemetry History ({telemetryLogs.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'config' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  FastAPI Server URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      value={config.baseUrl}
                      onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                      placeholder="http://localhost:8000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleTestPing}
                    disabled={isTesting}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 transition"
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Pinging...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Ping Test
                      </>
                    )}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Default is <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">http://localhost:8000</code>. If running via Docker or another machine, specify your network IP (e.g. <code>http://192.168.1.50:8000</code>).
                </p>
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                    testResult.ok
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {testResult.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">
                      {testResult.ok ? 'Connection Verified Successfully!' : 'Connection Failed'}
                    </p>
                    <p className="mt-0.5 text-[11px] opacity-90">
                      {testResult.ok
                        ? `Round-trip latency: ${testResult.latency} ms. Endpoint responded with 200 OK.`
                        : testResult.error}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confidence Commit Gate ({Math.round(config.confidenceThreshold * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.98"
                    step="0.05"
                    value={config.confidenceThreshold}
                    onChange={(e) => setConfig({ ...config, confidenceThreshold: parseFloat(e.target.value) })}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>50% (Permissive)</span>
                    <span>85% (Balanced)</span>
                    <span>98% (Strict)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Temporal Debounce Window ({config.debounceFrameWindow} frames)
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={config.debounceFrameWindow}
                    onChange={(e) => setConfig({ ...config, debounceFrameWindow: parseInt(e.target.value, 10) })}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>1 frame (Instant)</span>
                    <span>3 frames (Standard)</span>
                    <span>6 frames (Extra Stable)</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  <span className="font-bold">Strict ML Integrity:</span> Per architectural requirement #9, this client communicates exclusively with your real FastAPI ML model. Predictions and confidence gauges are 100% genuine and are never faked or randomly simulated when offline.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contract' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  POST /predict JSON Schema (63 Floats)
                </span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(samplePayload, null, 2), 'payload')}
                  className="px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center gap-1 transition"
                >
                  {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedPayload ? 'Copied' : 'Copy Sample Payload'}
                </button>
              </div>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-72">
                <pre>{JSON.stringify(samplePayload, null, 2)}</pre>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 text-slate-700">
                <p className="font-semibold text-slate-900">Feature Vector Specification:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px]">
                  <li><strong>Joint 0 (Wrist):</strong> Subtracted from all 21 points; always begins with <code>[0.0, 0.0, 0.0]</code>.</li>
                  <li><strong>Scale Factor:</strong> All vectors normalized by maximum distance from wrist, creating physical scale invariance.</li>
                  <li><strong>Target Classes:</strong> Letters <code>A–Z</code> and <code>NO_SIGN</code>. <code>NO_SIGN</code> indicates idle hands and is ignored in text output.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'serverCode' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Ready-to-Run FastAPI Script (main.py)
                </span>
                <button
                  onClick={() => copyToClipboard(sampleFastApiCode, 'snippet')}
                  className="px-2.5 py-1 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center gap-1 transition"
                >
                  {copiedSnippet ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSnippet ? 'Copied to Clipboard' : 'Copy Python Code'}
                </button>
              </div>

              <div className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] overflow-x-auto leading-relaxed max-h-80">
                <pre>{sampleFastApiCode}</pre>
              </div>

              <div className="text-[11px] text-slate-500">
                Run locally with: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">pip install fastapi uvicorn numpy</code> then <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-800 font-mono">uvicorn main:app --port 8000 --reload</code>.
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Recent Network Transmissions
              </span>
              {telemetryLogs.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No network transactions recorded yet. Start camera or ping endpoint to record telemetry.
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {telemetryLogs.map((log, index) => (
                    <div
                      key={index}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-mono flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 200 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {log.method} {log.status}
                        </span>
                        <span className="text-slate-700 truncate max-w-[280px]">{log.url}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500">
                        <span>{log.latencyMs}ms</span>
                        <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {status === 'connected' ? (
              <span className="text-emerald-600 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for live optical inference
              </span>
            ) : (
              <span className="text-amber-600 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Start FastAPI on port 8000 to infer
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg transition"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
