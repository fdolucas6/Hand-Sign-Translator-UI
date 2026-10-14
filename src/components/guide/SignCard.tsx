import React from 'react';
import { AlphabetGuideItem } from '../../types/asl';
import { Eye, Video } from 'lucide-react';

interface SignCardProps {
  item: AlphabetGuideItem;
  onSelect: (item: AlphabetGuideItem) => void;
  onPractice: (item: AlphabetGuideItem) => void;
}

export const SignCard: React.FC<SignCardProps> = ({ item, onSelect, onPractice }) => {
  const getDifficultyColor = (diff: AlphabetGuideItem['difficulty']) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-blue-300">
      <div className="p-5">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl font-extrabold text-slate-900 font-heading tracking-tight group-hover:text-blue-600 transition-colors">
              {item.letter}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              ASL Glyph
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyColor(item.difficulty)}`}>
            {item.difficulty}
          </span>
        </div>

        {/* Hand-Drawn Sketch Representation (Matching ASL Chart Style) */}
        <div className="h-56 bg-[#FFFFE0] rounded-xl border border-[#D1D2D3] flex flex-col items-center justify-between p-3.5 relative overflow-hidden group-hover:border-slate-400 group-hover:shadow-md transition-all">
          <div className="w-full flex-1 flex items-center justify-center min-h-0 pt-1">
            <img
              src={item.image || `/asl-sketches/${item.letter}.svg`}
              alt={`ASL Hand Sketch for Letter ${item.letter}`}
              className="max-h-36 w-auto object-contain group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>

          <div className="w-full text-center pt-2 pb-1 border-t border-[#E8E8C8]/60">
            <span className="text-4xl sm:text-5xl font-medium font-sans text-[#3C4043] leading-none select-none block">
              {item.letter}
            </span>
          </div>

          <span className="absolute top-2 right-2 text-[10px] font-mono text-slate-500 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
            {item.palmOrientation}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={() => onSelect(item)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>

        <button
          onClick={() => onPractice(item)}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Practice</span>
        </button>
      </div>
    </div>
  );
};
