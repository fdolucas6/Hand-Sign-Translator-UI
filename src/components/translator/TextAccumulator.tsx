import React, { useState } from 'react';
import { 
  Volume2, VolumeX, Copy, Check, Trash2, Delete, 
  CornerDownLeft, Space, Sparkles, MessageSquare 
} from 'lucide-react';
import { ASLClass } from '../../types/asl';

interface TextAccumulatorProps {
  currentSign: ASLClass | null;
  confidence: number;
  isStable: boolean;
  stabilityProgress: number; // 0 to 1
  committedText: string;
  onAddSpace: () => void;
  onBackspace: () => void;
  onClear: () => void;
  onSpeak: () => void;
  isSpeaking: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const TextAccumulator: React.FC<TextAccumulatorProps> = ({
  currentSign,
  confidence,
  isStable,
  stabilityProgress,
  committedText,
  onAddSpace,
  onBackspace,
  onClear,
  onSpeak,
  isSpeaking,
  soundEnabled,
  onToggleSound,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!committedText) return;
    navigator.clipboard.writeText(committedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const words = committedText.split(' ').filter(Boolean);
  const wordCount = words.length;
  const charCount = committedText.length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col justify-between overflow-hidden">
      {/* Active Token Hero Banner */}
      <div className="p-5 sm:p-6 border-b border-slate-100 bg-[#faf8ff] flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Oversized Translated Token Glyph */}
          <div className="relative">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-heading font-extrabold text-3xl sm:text-5xl shadow-sm border transition-all ${
                currentSign && currentSign !== 'NO_SIGN'
                  ? isStable
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 scale-105'
                    : 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-300 border-slate-200'
              }`}
            >
              {currentSign && currentSign !== 'NO_SIGN' ? currentSign : '—'}
            </div>

            {/* Circular / Edge Progress indicator */}
            {currentSign && currentSign !== 'NO_SIGN' && !isStable && (
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs"
                title="Stabilizing consecutive frames..."
              >
                {Math.round(stabilityProgress * 100)}%
              </div>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
              ACTIVE DETECTED TOKEN
            </div>
            <div className="text-sm font-bold text-slate-900 font-heading">
              {currentSign && currentSign !== 'NO_SIGN'
                ? `Sign Symbol: "${currentSign}"`
                : 'Awaiting Gesture'}
            </div>
            <div className="text-xs text-slate-500 font-mono">
              {currentSign && currentSign !== 'NO_SIGN'
                ? `Confidence: ${Math.round(confidence * 100)}% • ${isStable ? 'Ready to commit' : 'Stabilizing'}`
                : 'Keep hand visible within reticle'}
            </div>
          </div>
        </div>

        {/* Live Audio Feedback Pill */}
        <button
          onClick={onToggleSound}
          className={`p-2.5 rounded-xl border transition ${
            soundEnabled
              ? 'bg-blue-50 text-blue-600 border-blue-200'
              : 'bg-slate-100 text-slate-400 border-slate-200'
          }`}
          title={soundEnabled ? 'Speech synthesizer active' : 'Speech synthesizer muted'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>
      </div>

      {/* Accumulated Translation Workspace */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">
              Translated Text Workspace
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              {wordCount} words • {charCount} characters
            </span>
          </div>

          {/* Text Area / Stream Display */}
          <div className="min-h-[140px] max-h-[220px] overflow-y-auto p-4 bg-slate-50/70 border border-slate-200 rounded-xl font-heading text-lg sm:text-xl text-slate-900 leading-relaxed relative focus-within:ring-2 focus-within:ring-blue-500 focus-within:bg-white transition">
            {committedText ? (
              <span className="break-words">
                {committedText}
                <span className="inline-block w-2 h-5 bg-blue-600 ml-1 translate-y-0.5 animate-pulse" />
              </span>
            ) : (
              <span className="text-slate-400 italic text-sm">
                Translations will appear here automatically as your hand signs stabilize...
              </span>
            )}
          </div>
        </div>

        {/* Quick Action Utility Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Editing Controls */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={onAddSpace}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              title="Insert Space"
            >
              <Space className="w-4 h-4" />
              <span>Space</span>
            </button>

            <button
              onClick={onBackspace}
              disabled={!committedText}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-bold transition flex items-center gap-1.5"
              title="Delete last character"
            >
              <Delete className="w-4 h-4" />
              <span>Backspace</span>
            </button>

            <button
              onClick={onClear}
              disabled={!committedText}
              className="px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40 text-slate-600 rounded-lg text-xs font-semibold transition flex items-center gap-1"
              title="Clear all text (Alt + C)"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>

          {/* Primary Speech & Copy Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!committedText}
              className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onSpeak}
              disabled={!committedText}
              className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition flex items-center gap-2 shadow-xs active:scale-95 disabled:opacity-40 ${
                isSpeaking
                  ? 'bg-emerald-600 hover:bg-emerald-700 animate-pulse'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Speaking...' : 'Speak'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
