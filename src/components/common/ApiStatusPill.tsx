import React from 'react';
import { ConnectionStatus } from '../../types/asl';

interface ApiStatusPillProps {
  status: ConnectionStatus;
  latencyMs: number | null;
  baseUrl: string;
  onClick: () => void;
}

export const ApiStatusPill: React.FC<ApiStatusPillProps> = ({
  status,
  latencyMs,
  baseUrl,
  onClick,
}) => {
  // Format host name from URL
  let hostDisplay = 'FastAPI:8000';
  try {
    const url = new URL(baseUrl);
    hostDisplay = `FastAPI:${url.port || (url.protocol === 'https:' ? '443' : '80')}`;
  } catch {
    hostDisplay = 'FastAPI:8000';
  }

  const isConnected = status === 'connected';
  const isConnecting = status === 'connecting';

  return (
    <button
      onClick={onClick}
      title="Click to view API diagnostics & connection settings"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition border ${
        isConnected
          ? 'bg-emerald-50/90 text-emerald-800 border-emerald-200/80 hover:bg-emerald-100/90 hover:border-emerald-300'
          : isConnecting
          ? 'bg-blue-50/90 text-blue-800 border-blue-200/80 hover:bg-blue-100/90'
          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 hover:border-slate-300'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          isConnected
            ? 'bg-emerald-500 animate-pulse'
            : isConnecting
            ? 'bg-blue-500 animate-ping'
            : 'bg-amber-500'
        }`}
      />
      <span className="font-semibold">
        {isConnected
          ? `API: Ready (${hostDisplay})`
          : isConnecting
          ? 'API: Connecting...'
          : `API: Standby (${hostDisplay})`}
      </span>
      {isConnected && latencyMs !== null && (
        <span className="text-[10px] opacity-75 font-mono">({latencyMs}ms)</span>
      )}
    </button>
  );
};
