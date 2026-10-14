import React, { useState } from 'react';
import { X, Search, Grid, Columns } from 'lucide-react';
import { ASL_ALPHABET } from '../../data/aslAlphabet';
import { AlphabetGuideItem } from '../../types/asl';

interface AslAlphabetChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLetter?: (item: AlphabetGuideItem) => void;
}

export const AslAlphabetChartModal: React.FC<AslAlphabetChartModalProps> = ({
  isOpen,
  onClose,
  onSelectLetter,
}) => {
  const [filterText, setFilterText] = useState('');
  const [viewMode, setViewMode] = useState<'strip' | 'grid'>('strip');

  if (!isOpen) return null;

  const displayedAlphabet = ASL_ALPHABET.filter((item) =>
    item.letter.toLowerCase().includes(filterText.toLowerCase()) ||
    item.description.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="asl-alphabet-modal-title"
    >
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/90 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header - Matches the user's reference */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <h2
              id="asl-alphabet-modal-title"
              className="text-xl sm:text-2xl font-medium text-[#3C4043] tracking-tight font-sans"
            >
              American Sign Language (ASL) Alphabet
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono font-medium hidden sm:inline-block">
              26 Letters (A–Z)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
              <button
                onClick={() => setViewMode('strip')}
                title="Horizontal Strip View"
                className={`p-1.5 rounded-md flex items-center gap-1 transition ${
                  viewMode === 'strip' ? 'bg-white shadow-2xs font-semibold text-slate-800' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Columns className="w-4 h-4" />
                <span className="hidden md:inline">Scroll</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                title="Full Grid View"
                className={`p-1.5 rounded-md flex items-center gap-1 transition ${
                  viewMode === 'grid' ? 'bg-white shadow-2xs font-semibold text-slate-800' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span className="hidden md:inline">Grid</span>
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 stroke-[1.8]" />
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-2.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Search or jump to letter..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="text-xs text-slate-500 font-sans hidden sm:block">
            Showing <strong className="text-slate-700">{displayedAlphabet.length}</strong> of 26 hand signs
          </div>
        </div>

        {/* Modal Body - Authentic Cards View */}
        <div className="flex-1 p-6 overflow-auto bg-slate-50/40">
          {viewMode === 'strip' ? (
            /* Horizontal Strip Layout exactly as in the screenshot */
            <div className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin">
              {displayedAlphabet.map((item) => (
                <div
                  key={item.letter}
                  onClick={() => onSelectLetter && onSelectLetter(item)}
                  className="w-44 sm:w-52 h-80 sm:h-96 bg-[#FFFFE0] rounded-xl border border-[#D1D2D3] shadow-xs hover:shadow-lg hover:border-slate-400 flex flex-col items-center justify-between p-4 flex-shrink-0 transition-all cursor-pointer group"
                  title={`Click to inspect Letter ${item.letter}`}
                >
                  {/* Top: Black line sketch illustration */}
                  <div className="w-full flex-1 flex items-center justify-center min-h-0 pt-2">
                    <img
                      src={item.image || `/asl-sketches/${item.letter}.svg`}
                      alt={`ASL Sketch for ${item.letter}`}
                      className="max-h-48 sm:max-h-56 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>

                  {/* Bottom: Bold dark sans-serif letter */}
                  <div className="w-full text-center pb-2 pt-3 border-t border-[#E8E8C8]/60">
                    <span className="text-5xl sm:text-6xl font-medium font-sans text-[#3C4043] select-none block leading-none tracking-tight">
                      {item.letter}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Full Grid Layout */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {displayedAlphabet.map((item) => (
                <div
                  key={item.letter}
                  onClick={() => onSelectLetter && onSelectLetter(item)}
                  className="h-72 sm:h-80 bg-[#FFFFE0] rounded-xl border border-[#D1D2D3] shadow-xs hover:shadow-lg hover:border-slate-400 flex flex-col items-center justify-between p-3.5 transition-all cursor-pointer group"
                  title={`Click to inspect Letter ${item.letter}`}
                >
                  <div className="w-full flex-1 flex items-center justify-center min-h-0 pt-2">
                    <img
                      src={item.image || `/asl-sketches/${item.letter}.svg`}
                      alt={`ASL Sketch for ${item.letter}`}
                      className="max-h-40 sm:max-h-48 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                  </div>

                  <div className="w-full text-center pb-1 pt-2 border-t border-[#E8E8C8]/60">
                    <span className="text-4xl sm:text-5xl font-medium font-sans text-[#3C4043] select-none block leading-none">
                      {item.letter}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Click any card to inspect finger placements or practice with your webcam.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
