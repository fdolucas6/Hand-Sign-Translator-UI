import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', action: 'Pause or resume webcam video capture stream' },
    { key: 'Alt + C', action: 'Clear all accumulated translation text from workspace' },
    { key: 'Alt + S', action: 'Read translated text aloud using Web Speech synthesizer' },
    { key: 'Backspace', action: 'Delete the previous translated symbol token' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden"
        role="dialog"
        aria-labelledby="shortcuts-title"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#faf8ff]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Keyboard className="w-5 h-5" />
            </div>
            <h2 id="shortcuts-title" className="text-base font-bold text-slate-900 font-heading">
              Accessibility Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 divide-y divide-slate-100 text-xs">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <span className="text-slate-600">{sc.action}</span>
              <kbd className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-md font-mono font-bold text-slate-800 text-[11px] shadow-2xs whitespace-nowrap">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
