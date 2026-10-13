import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Layers } from 'lucide-react';
import { ASL_ALPHABET } from '../../data/aslAlphabet';
import { AlphabetGuideItem, ActivePage } from '../../types/asl';
import { SignCard } from './SignCard';
import { SignDetailModal } from './SignDetailModal';

interface SignGuidePageProps {
  onNavigate: (page: ActivePage) => void;
  onOpenPractice: (letter: AlphabetGuideItem) => void;
}

export const SignGuidePage: React.FC<SignGuidePageProps> = ({ onNavigate, onOpenPractice }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedOrientation, setSelectedOrientation] = useState<string>('All');
  const [activeSignModal, setActiveSignModal] = useState<AlphabetGuideItem | null>(null);

  const filteredAlphabet = useMemo(() => {
    return ASL_ALPHABET.filter((item) => {
      const matchesSearch =
        item.letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tips.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;

      const matchesOrientation =
        selectedOrientation === 'All' || item.palmOrientation === selectedOrientation;

      return matchesSearch && matchesDifficulty && matchesOrientation;
    });
  }, [searchQuery, selectedDifficulty, selectedOrientation]);

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-wider text-blue-600 uppercase font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            VISUAL REFERENCE &amp; ANATOMICAL DICTIONARY
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            ASL Fingerspelling Sign Guide
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Master all 26 manual alphabet hand shapes with anatomical joint placement, visual mnemonics, and real-time practice assistance.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-xs text-center min-w-[110px]">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
              TOTAL GLYPHS
            </span>
            <span className="text-xl font-extrabold text-slate-900 font-heading">
              26 Classes
            </span>
          </div>

          <div className="bg-white border border-blue-100 rounded-xl px-4 py-2.5 shadow-xs text-center min-w-[110px]">
            <span className="text-[10px] font-bold text-blue-600 uppercase font-mono block">
              STATIONARY
            </span>
            <span className="text-xl font-extrabold text-blue-700 font-heading">
              24 Static
            </span>
          </div>

          <div className="bg-white border border-amber-100 rounded-xl px-4 py-2.5 shadow-xs text-center min-w-[110px]">
            <span className="text-[10px] font-bold text-amber-600 uppercase font-mono block">
              DYNAMIC
            </span>
            <span className="text-xl font-extrabold text-amber-700 font-heading">
              2 Motion (J, Z)
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search letter, finger posture, or mnemonic tip..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Difficulty:</span>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Levels</option>
              <option value="Easy">Easy (11 signs)</option>
              <option value="Medium">Medium (11 signs)</option>
              <option value="Advanced">Advanced (4 signs)</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span>Palm Orientation:</span>
            <select
              value={selectedOrientation}
              onChange={(e) => setSelectedOrientation(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Orientations</option>
              <option value="Forward">Palm Forward (21)</option>
              <option value="Inward">Palm Inward (4)</option>
              <option value="Sideways">Palm Sideways (1)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alphabet Quick Scrubber Strip */}
      <div className="bg-slate-100/70 p-1.5 rounded-xl flex items-center justify-between overflow-x-auto gap-1 border border-slate-200/60 scrollbar-none">
        {ASL_ALPHABET.map((item) => (
          <button
            key={item.letter}
            onClick={() => {
              setSearchQuery(item.letter);
              const el = document.getElementById(`sign-card-${item.letter}`);
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition flex items-center justify-center font-heading ${
              searchQuery.toUpperCase() === item.letter
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            {item.letter}
          </button>
        ))}
      </div>

      {/* Grid of Signs */}
      {filteredAlphabet.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching signs found</h3>
          <p className="text-xs text-slate-500">
            Try adjusting your search criteria or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDifficulty('All');
              setSelectedOrientation('All');
            }}
            className="text-xs font-semibold text-blue-600 hover:underline pt-2"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredAlphabet.map((item) => (
            <div key={item.letter} id={`sign-card-${item.letter}`}>
              <SignCard
                item={item}
                onSelect={(sig) => setActiveSignModal(sig)}
                onPractice={(sig) => onOpenPractice(sig)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <SignDetailModal
        item={activeSignModal}
        onClose={() => setActiveSignModal(null)}
        onPractice={(sig) => {
          setActiveSignModal(null);
          onOpenPractice(sig);
        }}
      />
    </div>
  );
};
