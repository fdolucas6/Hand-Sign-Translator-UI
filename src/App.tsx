/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { TranslatorPage } from './components/translator/TranslatorPage';
import { SignGuidePage } from './components/guide/SignGuidePage';
import { HowItWorksPage } from './components/howitworks/HowItWorksPage';
import { AboutPage } from './components/about/AboutPage';
import { ApiSettingsModal } from './components/common/ApiSettingsModal';
import { PracticeModal } from './components/guide/PracticeModal';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { fastApiService } from './services/api';
import { speechService } from './services/speech';
import { ActivePage, ConnectionStatus, AlphabetGuideItem } from './types/asl';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('how-it-works');
  const [apiStatus, setApiStatus] = useState<ConnectionStatus>('idle');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [practiceItem, setPracticeItem] = useState<AlphabetGuideItem | null>(null);

  const [baseUrl, setBaseUrl] = useState(fastApiService.getConfig().baseUrl);

  // Subscribe to real API connection status changes
  useEffect(() => {
    const unsubscribe = fastApiService.onStatusChange((status, latency, error) => {
      setApiStatus(status);
      setLatencyMs(latency);
      setApiError(error);
    });

    // Check periodically if config baseUrl changed
    const interval = setInterval(() => {
      const current = fastApiService.getConfig()?.baseUrl;
      if (current) {
        setBaseUrl((prev) => (prev !== current ? current : prev));
      }
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    speechService.updateSettings({ autoSpeakWords: next });
    if (!next) {
      speechService.stop();
    }
  };

  const handleToggleContrast = () => {
    setHighContrast(!highContrast);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors ${
        highContrast
          ? 'bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white'
          : 'bg-[#faf8ff] text-[#131b2e] selection:bg-blue-100 selection:text-blue-900'
      }`}
    >
      {/* Navigation Bar */}
      <Navbar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        apiStatus={apiStatus}
        latencyMs={latencyMs}
        baseUrl={baseUrl}
        onOpenApiSettings={() => setIsApiSettingsOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        highContrast={highContrast}
        onToggleContrast={handleToggleContrast}
      />

      {/* Main Content Pages */}
      <main className="flex-1 flex flex-col">
        {activePage === 'translator' && (
          <TranslatorPage
            apiStatus={apiStatus}
            latencyMs={latencyMs}
            baseUrl={baseUrl}
            onOpenApiSettings={() => setIsApiSettingsOpen(true)}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onOpenPractice={(item) => setPracticeItem(item)}
          />
        )}

        {activePage === 'guide' && (
          <SignGuidePage
            onNavigate={(page) => setActivePage(page)}
            onOpenPractice={(item) => setPracticeItem(item)}
          />
        )}

        {activePage === 'how-it-works' && (
          <HowItWorksPage onNavigate={(page) => setActivePage(page)} />
        )}

        {activePage === 'about' && (
          <AboutPage onNavigate={(page) => setActivePage(page)} />
        )}
      </main>

      {/* Global Accessible Footer */}
      <Footer onOpenShortcuts={() => setIsShortcutsOpen(true)} />

      {/* API Connection & Diagnostics Settings Modal */}
      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => {
          setIsApiSettingsOpen(false);
          setBaseUrl(fastApiService.getConfig().baseUrl);
        }}
        status={apiStatus}
        latencyMs={latencyMs}
        errorMessage={apiError}
      />

      {/* Interactive Sign Practice Studio Modal */}
      <PracticeModal
        item={practiceItem}
        onClose={() => setPracticeItem(null)}
        onGoToTranslator={() => {
          setPracticeItem(null);
          setActivePage('translator');
        }}
      />

      {/* Keyboard Accessibility Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
