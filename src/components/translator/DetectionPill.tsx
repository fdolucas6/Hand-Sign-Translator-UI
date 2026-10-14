import React from 'react';
import { ASLClass } from '../../types/asl';
import { CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface DetectionPillProps {
  detectedSign: ASLClass | null;
  confidence: number; // 0 to 1
  isStable: boolean;
  stabilityProgress: number; // 0 to 1
  latencyMs: number;
  hasHand: boolean;
  isBackendConnected: boolean;
}

export const DetectionPill: React.FC<DetectionPillProps> = ({
  detectedSign,
  confidence,
  isStable,
  stabilityProgress,
  latencyMs,
  hasHand,
  isBackendConnected,
}) => {
  if (!hasHand) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-slate-300 text-xs shadow-lg animate-pulse">
        <span className="w-2 h-2 rounded-full bg-slate-400" />
        <span>Awaiting hand gesture in frame...</span>
      </div>
    );
  }

  if (!isBackendConnected) {
    return (
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/80 backdrop-blur-md border border-amber-600/70 text-amber-200 text-xs shadow-lg">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>Hand tracked (21 joints) • Backend offline (FastAPI:8000)</span>
      </div>
    );
  }

  if (detectedSign === 'NO_SIGN' || !detectedSign) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-slate-700/60 text-slate-300 text-xs shadow-lg">
        <span className="w-2 h-2 rounded-full bg-slate-400" />
        <span>Holding neutral pose (NO_SIGN)</span>
      </div>
    );
  }

  const confidencePercent = Math.round(confidence * 100);

  return (
    <div
      className={`inline-flex items-center gap-3 px-3.5 py-2 rounded-full backdrop-blur-md border shadow-xl transition-all ${
        isStable
          ? 'bg-[#F0FDFA]/95 border-[#0D9488] text-slate-900'
          : 'bg-[#FFFBEB]/95 border-[#D97706] text-slate-900'
      }`}
    >
      {/* Letter Token Glyph & Hand Sign Sketch */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full overflow-hidden bg-[#FEFDE8] border border-amber-300 shadow-2xs flex-shrink-0 p-0.5">
          <img
            src={`/asl-sketches/${detectedSign}.svg`}
            alt={`Sign ${detectedSign}`}
            className="w-full h-full object-contain"
          />
        </div>
        <span className="w-7 h-7 rounded-full bg-white shadow-xs border border-slate-200/80 flex items-center justify-center font-extrabold text-base text-slate-950 font-heading">
          {detectedSign}
        </span>
        <div className="text-left leading-tight">
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold font-heading">
              Letter {detectedSign}
            </span>
            {isStable ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9488]" />
            ) : (
              <Sparkles className="w-3 h-3 text-[#D97706] animate-spin" />
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {isStable ? 'Confirmed' : 'Stabilizing...'}
          </span>
        </div>
      </div>

      <div className="h-6 w-px bg-slate-300/60" />

      {/* Confidence Gauge Bar */}
      <div className="flex flex-col gap-0.5 min-w-[70px]">
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-slate-500">Conf.</span>
          <span className="font-bold text-slate-800">{confidencePercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-150 ${
              isStable ? 'bg-[#0D9488]' : 'bg-[#D97706]'
            }`}
            style={{ width: `${Math.min(100, Math.max(5, confidencePercent))}%` }}
          />
        </div>
      </div>

      {/* Latency Tag */}
      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 border-l border-slate-300/60 pl-2">
        <Clock className="w-3 h-3" />
        <span>{latencyMs}ms</span>
      </div>
    </div>
  );
};
