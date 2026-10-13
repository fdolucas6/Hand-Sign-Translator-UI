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

        {/* Hand Graphic / SVG Representation */}
        <div className="h-32 bg-[#faf8ff] rounded-xl border border-slate-100 flex items-center justify-center p-3 relative overflow-hidden group-hover:bg-blue-50/30 transition-colors">
          <svg
            viewBox="0 0 100 100"
            className="w-24 h-24 stroke-blue-600 fill-none stroke-[3] stroke-linecap-round stroke-linejoin-round"
          >
            {/* Guide circle */}
            <circle cx="50" cy="50" r="42" className="stroke-slate-200/60 stroke-1 stroke-dashed" />
            <path d={item.svgPath} />
          </svg>
          <span className="absolute bottom-1.5 right-2 text-[10px] font-mono text-slate-400 bg-white/80 px-1.5 py-0.5 rounded">
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
