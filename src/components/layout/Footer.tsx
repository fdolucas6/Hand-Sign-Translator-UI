import React from 'react';
import { Info, Keyboard } from 'lucide-react';

interface FooterProps {
  onOpenShortcuts?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenShortcuts }) => {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-4 px-4 sm:px-6 lg:px-8 mt-auto text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <span>
            <strong className="text-slate-700">Accessibility Notice:</strong> Optical ASL translation is optimized for well-lit environments and individual gesture recognition.
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
            <span className="bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold">Space</span>
            <span>Pause Capture</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600">
            <span className="bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold">Alt + C</span>
            <span>Clear Stream</span>
          </div>
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 ml-1"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>More</span>
            </button>
          )}
        </div>
      </div>
    </footer>
  );
};
