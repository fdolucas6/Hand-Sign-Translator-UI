import React, { useState } from 'react';
import { 
  ShieldCheck, Cpu, Code2, Users, Heart, Terminal, 
  Copy, Check, FileCode, CheckCircle2, ArrowRight 
} from 'lucide-react';
import { ActivePage } from '../../types/asl';

interface AboutPageProps {
  onNavigate: (page: ActivePage) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedReqs, setCopiedReqs] = useState(false);

  const pythonRequirements = `fastapi>=0.110.0
uvicorn[standard]>=0.28.0
numpy>=1.24.0
scikit-learn>=1.3.0
pydantic>=2.0.0
# optional if using onnx or pytorch:
# onnxruntime>=1.16.0
# torch>=2.0.0`;

  const copyText = (text: string, type: 'code' | 'reqs') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedReqs(true);
      setTimeout(() => setCopiedReqs(false), 2000);
    }
  };

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 animate-fade-in">
      {/* Hero Header */}
      <div className="space-y-3 border-b border-slate-200/80 pb-8">
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 uppercase font-mono">
          <span className="w-2 h-2 rounded-full bg-blue-600" />
          ETHICAL ASSISTIVE INTELLIGENCE &amp; API SPECIFICATION
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-heading">
          About Hand Sign Translator
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-3xl">
          Bridging non-verbal communication through real-time 63-dimensional spatial joint tracking, mathematical scale invariance, and high-performance neural inference.
        </p>
      </div>

      {/* Core Values / 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 font-heading">
            Assistive Accessibility First
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Engineered specifically for Deaf, Hard of Hearing, non-verbal individuals, and ASL learners. Focuses on effortless legibility, haptic visual feedback, and real-time auditory synthesis.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 font-heading">
            Strict 100% Client-Side Privacy
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Raw optical camera frames never leave your local browser memory. Frames are processed entirely into anonymous 63-float coordinate vectors, ensuring complete personal privacy.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900 font-heading">
            Genuine Machine Learning
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Directly connected to real Python FastAPI endpoints and trained neural weights. We reject synthetic mock predictions and maintain strict telemetry transparency.
          </p>
        </div>
      </div>

      {/* Technical Integration Guide for Python FastAPI Backend */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                FastAPI Backend Setup Guide
              </h2>
              <p className="text-xs text-slate-500">
                How to run your existing Python model alongside this frontend
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('translator')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>Open Translator Studio</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            This application communicates with your existing machine learning model through a clean REST and WebSocket interface. To test and predict real hand signs from your webcam, ensure your FastAPI backend exposes the <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">/predict</code> endpoint with CORS enabled.
          </p>

          {/* Step by Step list */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div>
                <p className="font-bold text-slate-900">Install Python Dependencies</p>
                <p className="mt-0.5 text-slate-500">Create a virtual environment and install FastAPI and Uvicorn:</p>
                <div className="mt-2 flex items-center justify-between bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px]">
                  <span>pip install fastapi "uvicorn[standard]" numpy scikit-learn</span>
                  <button
                    onClick={() => copyText('pip install fastapi "uvicorn[standard]" numpy scikit-learn', 'reqs')}
                    className="text-slate-400 hover:text-white ml-2"
                  >
                    {copiedReqs ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                2
              </span>
              <div className="flex-1">
                <p className="font-bold text-slate-900">Ensure CORS Middleware is Enabled</p>
                <p className="mt-0.5 text-slate-500">
                  Because the web app runs in your browser, the FastAPI backend must permit cross-origin requests from the browser:
                </p>
                <div className="mt-2 p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto">
                  <pre>{`from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`}</pre>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                3
              </span>
              <div className="flex-1">
                <p className="font-bold text-slate-900">Run the Server on Port 8000</p>
                <p className="mt-0.5 text-slate-500">Start the backend service:</p>
                <div className="mt-2 bg-slate-900 text-emerald-400 p-2.5 rounded-lg font-mono text-[11px]">
                  uvicorn main:app --host 0.0.0.0 --port 8000 --reload
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                4
              </span>
              <div>
                <p className="font-bold text-slate-900">Connect in Real-Time</p>
                <p className="mt-0.5 text-slate-500">
                  The navbar status pill will immediately switch to <span className="text-emerald-600 font-bold">API: Ready (FastAPI:8000)</span>. When you hold your hand up to the camera, 63 normalized coordinates are streamed to your model, and the predicted sign is committed live to your text accumulator!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Normalization Formula Math Box */}
      <div className="bg-[#faf8ff] rounded-2xl p-6 sm:p-8 border border-[#e2e7ff] space-y-4">
        <div className="flex items-center gap-2 text-blue-700">
          <Code2 className="w-5 h-5" />
          <h2 className="text-base font-bold font-heading">
            Exact Normalization Formula (MediaPipe 63 Floats)
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          The application regression model consumes 21 3-dimensional coordinates $(x_i, y_i, z_i)$ for $i = 0 \dots 20$, transformed via wrist centering and palm-scale invariance:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-blue-600 font-bold block mb-1">1. Wrist Centering:</span>
            <div className="text-slate-800 space-y-1">
              <p>x'ᵢ = xᵢ - x₀</p>
              <p>y'ᵢ = yᵢ - y₀</p>
              <p>z'ᵢ = zᵢ - z₀</p>
              <p className="text-slate-400 text-[10px] mt-1">// (Joint 0 always translates to [0, 0, 0])</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-emerald-600 font-bold block mb-1">2. Palm-Scale Invariance:</span>
            <div className="text-slate-800 space-y-1">
              <p>scale = maxᵢ √(x'ᵢ² + y'ᵢ² + z'ᵢ²)</p>
              <p>X_norm = [x'₀/s, y'₀/s, z'₀/s, ..., z'₂₀/s]</p>
              <p className="text-slate-400 text-[10px] mt-1">// Vector dimension = 21 × 3 = 63</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ready to start banner */}
      <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-bold font-heading">
            Experience Live Real-Time Translation
          </h2>
          <p className="text-slate-400 text-xs">
            Enable your camera and witness zero-latency 3D hand tracking and speech assembly.
          </p>
        </div>
        <button
          onClick={() => onNavigate('translator')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-sm transition active:scale-95 flex items-center gap-2 flex-shrink-0"
        >
          <span>Open Live Translator</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
