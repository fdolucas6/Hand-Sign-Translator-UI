import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CameraViewport } from './CameraViewport';
import { TextAccumulator } from './TextAccumulator';
import { TelemetryBar } from './TelemetryBar';
import { MiniAlphabetReference } from './MiniAlphabetReference';
import { SignDetailModal } from '../guide/SignDetailModal';
import { AslAlphabetChartModal } from '../guide/AslAlphabetChartModal';
import { fastApiService } from '../../services/api';
import { speechService } from '../../services/speech';
import { normalizeLandmarks } from '../../services/normalization';
import { 
  ASLClass, Landmark3D, ConnectionStatus, AlphabetGuideItem, 
  PredictionResponse 
} from '../../types/asl';
import { LandmarkFrameResult } from '../../services/mediapipe';
import { ASL_ALPHABET } from '../../data/aslAlphabet';
import { AlertCircle, Server, RefreshCw } from 'lucide-react';

interface TranslatorPageProps {
  apiStatus: ConnectionStatus;
  latencyMs: number | null;
  baseUrl: string;
  onOpenApiSettings: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenPractice: (item: AlphabetGuideItem) => void;
}

export const TranslatorPage: React.FC<TranslatorPageProps> = ({
  apiStatus,
  latencyMs,
  baseUrl,
  onOpenApiSettings,
  soundEnabled,
  onToggleSound,
  onOpenPractice,
}) => {
  // Detection and state
  const [currentSign, setCurrentSign] = useState<ASLClass | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [isStable, setIsStable] = useState(false);
  const [stabilityProgress, setStabilityProgress] = useState(0);
  const [committedText, setCommittedText] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false);

  // Telemetry
  const [features63, setFeatures63] = useState<number[]>([]);
  const [wristOrigin, setWristOrigin] = useState<Landmark3D | null>(null);
  const [scaleFactor, setScaleFactor] = useState<number>(1.0);
  const [handedness, setHandedness] = useState<'Left' | 'Right'>('Right');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Debounce tracking
  const [debounceCount, setDebounceCount] = useState(0);
  const candidateHistoryRef = useRef<ASLClass[]>([]);
  const lastCommittedRef = useRef<ASLClass | null>(null);
  const isInferringRef = useRef(false);

  // Selected letter modal
  const [selectedGuideLetter, setSelectedGuideLetter] = useState<AlphabetGuideItem | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  const debounceTarget = 5;
  const confidenceThreshold = 0.70;

  // Sync speech state
  useEffect(() => {
    return speechService.onSpeakingChange((speaking) => {
      setIsSpeaking(speaking);
    });
  }, []);

  // Global Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPaused((p) => !p);
      } else if (e.altKey && e.code === 'KeyC') {
        e.preventDefault();
        handleClear();
      } else if (e.altKey && e.code === 'KeyS') {
        e.preventDefault();
        handleSpeak();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [committedText]);

  // Frame landmarks handler from CameraViewport
  const handleLandmarksExtracted = useCallback(
    async (frameResult: LandmarkFrameResult | null) => {
      if (isPaused) return;

      if (!frameResult) {
        setCurrentSign(null);
        setConfidence(0);
        setIsStable(false);
        setStabilityProgress(0);
        setDebounceCount(0);
        candidateHistoryRef.current = [];
        return;
      }

      setHandedness(frameResult.handedness);

      // 1. Compute exact 63-feature normalized vector
      const norm = normalizeLandmarks(frameResult.landmarks);
      setFeatures63(norm.features);
      setWristOrigin(norm.wristOrigin);
      setScaleFactor(norm.scaleFactor);

      // 2. Query real FastAPI backend
      if (apiStatus === 'connected' && !isInferringRef.current) {
        isInferringRef.current = true;
        try {
          const prediction: PredictionResponse | null = await fastApiService.predict(
            norm.features,
            frameResult.landmarks,
            frameResult.handedness
          );

          if (prediction) {
            const sign = prediction.sign;
            const conf = prediction.confidence;

            setCurrentSign(sign);
            setConfidence(conf);

            // Per requirement 8: Support A-Z and NO_SIGN. Do not display NO_SIGN as translated letter.
            if (sign === 'NO_SIGN' || conf < confidenceThreshold) {
              setDebounceCount(0);
              setIsStable(false);
              setStabilityProgress(0);
              candidateHistoryRef.current = [];
              lastCommittedRef.current = null;
              return;
            }

            // Push to candidate buffer
            const hist = candidateHistoryRef.current;
            hist.push(sign);
            if (hist.length > debounceTarget) {
              hist.shift();
            }

            // Check if all recent frames match
            const matchingCount = hist.filter((candidate) => candidate === sign).length;
            
            const allMatch = hist.length >= debounceTarget && matchingCount >= 4;

            const progress = hist.length / debounceTarget;
            setStabilityProgress(progress);
            setDebounceCount(hist.length);

            if (allMatch) {
              setIsStable(true);
              // Only commit once per continuous hold
              if (lastCommittedRef.current !== sign) {
                lastCommittedRef.current = sign;
                setCommittedText((prev) => prev + sign);

                // Sound feedback if enabled
                if (soundEnabled) {
                  speechService.speak(sign, { rate: 1.2 });
                }
              }
            } else {
              setIsStable(false);
            }
          }
        } catch (e) {
          // Handled in service
        } finally {
          isInferringRef.current = false;
        }
      } else if (apiStatus !== 'connected') {
        // Backend is offline - we honestly do NOT generate fake predictions per requirement 9.
        setCurrentSign(null);
        setConfidence(0);
        setIsStable(false);
        setStabilityProgress(0);
      }
    },
    [apiStatus, isPaused, soundEnabled, debounceTarget, confidenceThreshold]
  );

  const handleAddSpace = () => {
    setCommittedText((prev) => (prev.endsWith(' ') ? prev : prev + ' '));
    lastCommittedRef.current = null;
  };

  const handleBackspace = () => {
    setCommittedText((prev) => prev.slice(0, -1));
    lastCommittedRef.current = null;
  };

  const handleClear = () => {
    setCommittedText('');
    lastCommittedRef.current = null;
  };

  const handleSpeak = () => {
    if (committedText.trim()) {
      speechService.speak(committedText.trim());
    }
  };

  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Offline Alert Banner if backend is not yet started */}
      {apiStatus !== 'connected' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-amber-900 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500 text-white flex-shrink-0 mt-0.5">
              <Server className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-sm font-bold font-heading text-amber-950">
                Awaiting Connection to your Python FastAPI Backend
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed">
                MediaPipe landmark tracking and 63-vector normalization are active locally in your browser. Start your FastAPI server on <code className="bg-amber-100 px-1 py-0.5 rounded font-mono font-bold">{baseUrl}</code> to enable live neural predictions.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenApiSettings}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center gap-1.5 self-start sm:self-auto flex-shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Connection Diagnostics</span>
          </button>
        </div>
      )}

      {/* Main 12-Column Grid (7:5 desktop ratio per design specs) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Columns on Desktop): Live Camera Viewport & Telemetry */}
        <div className="lg:col-span-7 space-y-5">
          <CameraViewport
            onLandmarksExtracted={handleLandmarksExtracted}
            detectedSign={currentSign}
            confidence={confidence}
            isStable={isStable}
            stabilityProgress={stabilityProgress}
            latencyMs={latencyMs || 18}
            isBackendConnected={apiStatus === 'connected'}
            isPaused={isPaused}
            onTogglePause={() => setIsPaused(!isPaused)}
          />

          <TelemetryBar
            features63={features63}
            wristOrigin={wristOrigin}
            scaleFactor={scaleFactor}
            handedness={handedness}
            debounceCount={debounceCount}
            debounceTarget={debounceTarget}
          />
        </div>

        {/* Right Column (5 Columns on Desktop): Text Workspace & Quick Alphabet */}
        <div className="lg:col-span-5 space-y-5">
          <TextAccumulator
            currentSign={currentSign}
            confidence={confidence}
            isStable={isStable}
            stabilityProgress={stabilityProgress}
            committedText={committedText}
            onAddSpace={handleAddSpace}
            onBackspace={handleBackspace}
            onClear={handleClear}
            onSpeak={handleSpeak}
            isSpeaking={isSpeaking}
            soundEnabled={soundEnabled}
            onToggleSound={onToggleSound}
          />

          <MiniAlphabetReference
            onSelectLetter={(letter) => setSelectedGuideLetter(letter)}
            onOpenChart={() => setIsChartModalOpen(true)}
            activeLetter={currentSign}
          />
        </div>
      </div>

      {/* Quick Letter Detail Modal */}
      <SignDetailModal
        item={selectedGuideLetter}
        onClose={() => setSelectedGuideLetter(null)}
        onPractice={(letter) => {
          setSelectedGuideLetter(null);
          onOpenPractice(letter);
        }}
      />

      {/* ASL Alphabet Chart Modal (Matching Screenshot) */}
      <AslAlphabetChartModal
        isOpen={isChartModalOpen}
        onClose={() => setIsChartModalOpen(false)}
        onSelectLetter={(letter) => {
          setIsChartModalOpen(false);
          setSelectedGuideLetter(letter);
        }}
      />
    </div>
  );
};
