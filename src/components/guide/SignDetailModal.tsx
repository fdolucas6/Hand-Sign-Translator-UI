import React, { useState } from 'react';
import { X, Video, AlertCircle, CheckCircle, Lightbulb, Image as ImageIcon, Sparkles } from 'lucide-react';
import { AlphabetGuideItem } from '../../types/asl';

interface SignDetailModalProps {
  item: AlphabetGuideItem | null;
  onClose: () => void;
  onPractice: (item: AlphabetGuideItem) => void;
}

export const SignDetailModal: React.FC<SignDetailModalProps> = ({
  item,
  onClose,
  onPractice,
}) => {
  const [viewMode, setViewMode] = useState<'sketch' | 'landmark'>('sketch');

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="sign-detail-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#faf8ff]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center font-heading shadow-sm">
              {item.letter}
            </div>
            <div>
              <h2 id="sign-detail-title" className="text-xl font-bold text-slate-900 font-heading">
                Sign Details: Letter {item.letter}
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500 font-medium">Difficulty: <strong>{item.difficulty}</strong></span>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-500 font-medium">Palm: <strong>{item.palmOrientation}</strong></span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Hand Sketch Display */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="relative w-44 h-52 bg-[#FFFFE0] rounded-xl border border-[#D1D2D3] overflow-hidden flex flex-col items-center justify-between flex-shrink-0 shadow-xs p-3">
              <div className="w-full flex-1 flex items-center justify-center min-h-0 pt-1">
                {viewMode === 'sketch' ? (
                  <img
                    src={item.image || `/asl-sketches/${item.letter}.svg`}
                    alt={`ASL Hand Sketch for Letter ${item.letter}`}
                    className="max-h-32 w-auto object-contain"
                  />
                ) : (
                  <svg
                    viewBox="0 0 100 100"
                    className="w-24 h-24 stroke-blue-600 fill-none stroke-[3] stroke-linecap-round stroke-linejoin-round"
                  >
                    <circle cx="50" cy="50" r="42" className="stroke-slate-300 stroke-1 stroke-dashed" />
                    <path d={item.svgPath} />
                  </svg>
                )}
              </div>

              {viewMode === 'sketch' && (
                <div className="w-full text-center pb-5 pt-1.5 border-t border-[#E8E8C8]/60">
                  <span className="text-4xl font-medium font-sans text-[#3C4043] leading-none select-none block">
                    {item.letter}
                  </span>
                </div>
              )}

              {/* View Switcher Overlay */}
              <div className="absolute bottom-1 inset-x-1 flex justify-center">
                <div className="bg-slate-900/85 backdrop-blur-xs rounded-lg p-0.5 border border-slate-700 flex gap-0.5 text-[9px] font-mono shadow-xs">
                  <button
                    onClick={() => setViewMode('sketch')}
                    className={`px-1.5 py-0.5 rounded transition ${
                      viewMode === 'sketch' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Hand Sketch
                  </button>
                  <button
                    onClick={() => setViewMode('landmark')}
                    className={`px-1.5 py-0.5 rounded transition ${
                      viewMode === 'landmark' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Wireframe
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 flex-1">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                Hand Sketch Illustration
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>


          {/* Finger Positions List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
              Anatomical Joint Placement
            </h3>
            <div className="space-y-1.5">
              {item.fingerPositions.map((pos, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{pos}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mnemonics & Tips */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">Memory Tip:</strong>
              {item.tips}
            </div>
          </div>

          {/* Common Confusions */}
          {item.confusedWith && item.confusedWith.length > 0 && (
            <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-900 leading-relaxed">
                <strong className="font-semibold block mb-0.5">Commonly Confused With:</strong>
                Often confused with <span className="font-bold text-blue-700">{item.confusedWith.join(', ')}</span>. Verify thumb and fingertip articulators carefully.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Back to Alphabet
          </button>
          <button
            onClick={() => {
              onClose();
              onPractice(item);
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 shadow-sm transition active:scale-95"
          >
            <Video className="w-4 h-4" />
            <span>Practice Sign "{item.letter}"</span>
          </button>
        </div>
      </div>
    </div>
  );
};
