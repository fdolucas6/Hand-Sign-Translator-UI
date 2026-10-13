import React, { useState } from 'react';
import { Volume2, VolumeX, Moon, Sun, User, Menu, X } from 'lucide-react';
import { ActivePage, ConnectionStatus } from '../../types/asl';
import { AppLogo } from '../common/AppLogo';
import { ApiStatusPill } from '../common/ApiStatusPill';

interface NavbarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  apiStatus: ConnectionStatus;
  latencyMs: number | null;
  baseUrl: string;
  onOpenApiSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  highContrast: boolean;
  onToggleContrast: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  apiStatus,
  latencyMs,
  baseUrl,
  onOpenApiSettings,
  soundEnabled,
  onToggleSound,
  highContrast,
  onToggleContrast,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActivePage; label: string }[] = [
    { id: 'translator', label: 'Translator' },
    { id: 'guide', label: 'Sign Guide' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'about', label: 'About' },
  ];

  const handleNavClick = (page: ActivePage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('translator')}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-xl p-1"
            >
              <AppLogo className="w-9 h-9 transition-transform group-hover:scale-105" size={36} />
              <div className="flex items-center gap-1.5 text-left">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg font-heading">
                  Hand Sign
                </span>
                <span className="font-medium text-slate-700 tracking-tight text-base sm:text-lg font-heading">
                  Translator
                </span>
              </div>
            </button>

            {/* ASL AI Badge */}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#eaedff] text-[#2563eb] border border-[#dbe4ff]">
              ASL AI
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                    isActive
                      ? 'text-blue-700 bg-blue-50/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Status Pill */}
            <ApiStatusPill
              status={apiStatus}
              latencyMs={latencyMs}
              baseUrl={baseUrl}
              onClick={onOpenApiSettings}
            />

            {/* Audio Toggle */}
            <button
              onClick={onToggleSound}
              title={soundEnabled ? 'Speech audio enabled' : 'Speech audio muted'}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Speech Audio"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Contrast / Theme Toggle */}
            <button
              onClick={onToggleContrast}
              title={highContrast ? 'Switch to standard contrast' : 'Switch to high contrast'}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Contrast"
            >
              {highContrast ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Primary Action Button */}
            {activePage !== 'translator' && (
              <button
                onClick={() => onNavigate('translator')}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition active:scale-95"
              >
                Start Translating
              </button>
            )}

            {/* User Profile Avatar */}
            <button
              onClick={onOpenApiSettings}
              title="Connection Diagnostics & System Spec"
              className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ApiStatusPill
              status={apiStatus}
              latencyMs={latencyMs}
              baseUrl={baseUrl}
              onClick={onOpenApiSettings}
            />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 animate-fade-in shadow-lg">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition ${
                  isActive
                    ? 'text-blue-700 bg-blue-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={onToggleSound}
                className="p-2 rounded-lg bg-slate-100 text-slate-700"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              </button>
              <button
                onClick={onToggleContrast}
                className="p-2 rounded-lg bg-slate-100 text-slate-700"
              >
                {highContrast ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500" />}
              </button>
            </div>

            <button
              onClick={() => {
                onNavigate('translator');
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600"
            >
              Start Translating
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
