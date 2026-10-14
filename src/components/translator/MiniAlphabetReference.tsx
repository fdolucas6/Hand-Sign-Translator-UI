import React, { useState } from 'react';
import { ASL_ALPHABET } from '../../data/aslAlphabet';
import { AlphabetGuideItem } from '../../types/asl';
import { ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

interface MiniAlphabetReferenceProps {
  onSelectLetter: (item: AlphabetGuideItem) => void;
  onOpenChart?: () => void;
  activeLetter?: string | null;
}

export const MiniAlphabetReference: React.FC<MiniAlphabetReferenceProps> = ({
  onSelectLetter,
  onOpenChart,
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
        <div className="flex items-center gap-2">
          {onOpenChart && (
            <button
              onClick={onOpenChart}
              className="text-xs text-amber-700 hover:text-amber-900 font-semibold bg-[#FFFFE0] border border-[#D1D2D3] px-2 py-0.5 rounded-md hover:border-slate-400 transition"
            >
              Full ASL Chart
            </button>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          >
            {isOpen ? 'Compact' : 'Expanded'}
          </button>
        </div>
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
              className={`flex-shrink-0 flex flex-col items-center justify-center rounded-xl p-1.5 border transition-all ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300 scale-105'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-300'
              } ${isOpen ? 'w-16 h-20' : 'w-14 h-16'}`}
            >
              <span className={`text-xs font-extrabold font-heading ${isActive ? 'text-white' : 'text-slate-900'}`}>
                {item.letter}
              </span>
              <div className="w-8 h-8 rounded-md overflow-hidden mt-0.5 border border-[#D1D2D3] bg-[#FFFFE0] shadow-2xs flex-shrink-0 p-0.5">
                <img
                  src={item.image || `/asl-sketches/${item.letter}.svg`}
                  alt={`Sign ${item.letter}`}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
