import React from 'react';
import { Landmark3D } from '../../types/asl';
import { Activity, ShieldCheck, Cpu } from 'lucide-react';

interface TelemetryBarProps {
  features63: number[];
  wristOrigin: Landmark3D | null;
  scaleFactor: number;
  handedness: 'Left' | 'Right';
  debounceCount: number;
  debounceTarget: number;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({
  features63,
  wristOrigin,
  scaleFactor,
  handedness,
  debounceCount,
  debounceTarget,
}) => {
  const hasData = features63.length === 63;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            63-Dimensional Spatial Vector Telemetry
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <span className="text-slate-500">Debounce:</span>
          <span className="font-bold text-slate-800">
            {debounceCount} / {debounceTarget} frames
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Hand:</span>
          <span className="font-bold text-blue-600">{handedness}</span>
        </div>
      </div>

      {/* Feature Spectrum Visualizer Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span>Wrist Joint 0 (Origin [0,0,0])</span>
          <span>Fingertip Joints (4, 8, 12, 16, 20)</span>
        </div>

        {/* 63 Mini Bars */}
        <div className="h-6 bg-slate-50 border border-slate-200 rounded-lg p-1 flex items-center gap-[2px] overflow-hidden">
          {hasData ? (
            features63.map((val, idx) => {
              // Normalized values typically between -1.5 and 1.5
              const normalizedHeight = Math.min(100, Math.max(10, Math.abs(val) * 70));
              const isPositive = val >= 0;
              return (
                <div
                  key={idx}
                  className="flex-1 h-full flex items-center justify-center"
                  title={`Feature [${idx}]: ${val.toFixed(4)}`}
                >
                  <div
                    className={`w-full rounded-xs transition-all ${
                      idx < 3
                        ? 'bg-slate-300'
                        : isPositive
                        ? 'bg-blue-500'
                        : 'bg-cyan-500'
                    }`}
                    style={{ height: `${normalizedHeight}%` }}
                  />
                </div>
              );
            })
          ) : (
            <div className="w-full text-center text-[10px] text-slate-400 font-mono italic">
              Awaiting hand landmarks to populate 63-dimensional tensor buffer...
            </div>
          )}
        </div>
      </div>

      {/* Origin & Scale Factor Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] font-mono">
        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
          <span className="text-slate-400 block text-[10px]">ORIGIN X (WRIST)</span>
          <span className="font-bold text-slate-800">
            {wristOrigin ? wristOrigin.x.toFixed(4) : '0.0000'}
          </span>
        </div>

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
          <span className="text-slate-400 block text-[10px]">ORIGIN Y (WRIST)</span>
          <span className="font-bold text-slate-800">
            {wristOrigin ? wristOrigin.y.toFixed(4) : '0.0000'}
          </span>
        </div>

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
          <span className="text-slate-400 block text-[10px]">PALM SCALE (EUCLIDEAN)</span>
          <span className="font-bold text-blue-600">
            {scaleFactor > 0 ? scaleFactor.toFixed(4) : '1.0000'}
          </span>
        </div>

        <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
          <span className="text-slate-400 block text-[10px]">NORMALIZED TENSOR</span>
          <span className="font-bold text-emerald-600">
            {hasData ? '63 Floats Valid' : 'Standby'}
          </span>
        </div>
      </div>
    </div>
  );
};
