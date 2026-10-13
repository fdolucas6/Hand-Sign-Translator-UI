import React, { useState } from 'react';
import { ASL_ALPHABET } from '../../data/aslAlphabet';
import { AlphabetGuideItem } from '../../types/asl';
import { ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

interface MiniAlphabetReferenceProps {
  onSelectLetter: (item: AlphabetGuideItem) => void;
  activeLetter?: string | null;
}

export const MiniAlphabetReference: React.FC<MiniAlphabetReferenceProps> = ({
  onSelectLetter,
  activeLetter,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
            Quick Sign Reference (A–Z)
          </span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
        >
          {isOpen ? 'Compact View' : 'Expanded View'}
        </button>
      </div>

      {/* Letters Horizontal Carousel / Strip */}
      <div
        className={`flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none transition-all ${
          isOpen ? 'flex-wrap' : ''
        }`}
      >
        {ASL_ALPHABET.map((item) => {
          const isActive = activeLetter === item.letter;
          return (
            <button
              key={item.letter}
              onClick={() => onSelectLetter(item)}
              title={`${item.letter}: ${item.tips}`}
              className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl p-2 border transition-all ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm scale-105'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 hover:border-blue-300'
              } ${isOpen ? 'w-16 h-20' : 'w-12 h-14'}`}
            >
              <span className="text-base font-extrabold font-heading">
                {item.letter}
              </span>
              <svg
                viewBox="0 0 100 100"
                className={`w-6 h-6 stroke-current fill-none stroke-[3] stroke-linecap-round stroke-linejoin-round mt-0.5 ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              >
                <path d={item.svgPath} />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
};
