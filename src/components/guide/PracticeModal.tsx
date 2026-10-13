import React, { useRef, useEffect, useState, useCallback } from 'react';
import { X, CheckCircle2, Video, ArrowRight, RefreshCw, Sparkles, Check } from 'lucide-react';
import { AlphabetGuideItem, Landmark3D, ActivePage } from '../../types/asl';
import { MediaPipeHandTracker, LandmarkFrameResult } from '../../services/mediapipe';
import { normalizeLandmarks } from '../../services/normalization';

interface PracticeModalProps {
  item: AlphabetGuideItem | null;
  onClose: () => void;
  onGoToTranslator: () => void;
}

export const PracticeModal: React.FC<PracticeModalProps> = ({
  item,
  onClose,
  onGoToTranslator,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackerRef = useRef<MediaPipeHandTracker | null>(null);

  const [hasCamera, setHasCamera] = useState(false);
  const [hasHand, setHasHand] = useState(false);
  const [isAligned, setIsAligned] = useState(false);
  const [holdTimer, setHoldTimer] = useState(0);

  const startPracticeCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setHasCamera(true);
      }
    } catch (e) {
      console.warn('Practice camera failed', e);
      setHasCamera(false);
    }
  }, []);

  useEffect(() => {
    if (!item) return;

    const tracker = new MediaPipeHandTracker();
    trackerRef.current = tracker;

    tracker.initialize().then(() => {
      startPracticeCamera();
    });

    tracker.onLandmarks((res: LandmarkFrameResult | null) => {
      setHasHand(!!res);

      const canvas = canvasRef.current;
      if (canvas && res) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          tracker.drawSkeleton(ctx, res.landmarks, canvas.width, canvas.height, {
            mirror: true,
            primaryColor: isAligned ? '#10b981' : '#06b6d4',
            jointColor: '#ffffff',
          });
        }
      } else if (canvas && !res) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });

    const interval = setInterval(() => {
      if (videoRef.current && videoRef.current.readyState >= 2 && trackerRef.current) {
        trackerRef.current.processVideoFrame(videoRef.current);
      }
    }, 40);

    return () => {
      clearInterval(interval);
      tracker.destroy();
      trackerRef.current = null;
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [item, startPracticeCamera, isAligned]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-labelledby="practice-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#faf8ff]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center font-heading">
              {item.letter}
            </div>
            <div>
              <h2 id="practice-modal-title" className="text-lg font-bold text-slate-900 font-heading">
                Interactive Practice Studio: Letter "{item.letter}"
              </h2>
              <p className="text-xs text-slate-500">
                Hold your hand in frame and match the anatomical finger placement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Studio Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Live Practice Viewport */}
          <div className="md:col-span-7 space-y-3">
            <div className="relative aspect-[4/3] bg-[#090D16] rounded-2xl overflow-hidden shadow-lg border border-slate-800 flex items-center justify-center">
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Status pill in camera */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs font-mono flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${hasHand ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{hasHand ? 'Tracking 21 3D Landmarks' : 'Awaiting Hand in Viewport'}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 text-center font-mono">
              Align your hand so all 21 joint nodes turn cyan. Keep your wrist near the bottom.
            </p>
          </div>

          {/* Right: Reference Guide & Checklist */}
          <div className="md:col-span-5 space-y-4">
            {/* Reference Image */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono block mb-2">
                Target Hand Pose
              </span>
              <div className="w-24 h-24 mx-auto bg-white rounded-xl border border-slate-200 flex items-center justify-center shadow-xs">
                <svg
                  viewBox="0 0 100 100"
                  className="w-18 h-18 stroke-blue-600 fill-none stroke-[3] stroke-linecap-round stroke-linejoin-round"
                >
                  <circle cx="50" cy="50" r="42" className="stroke-slate-200 stroke-1 stroke-dashed" />
                  <path d={item.svgPath} />
                </svg>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider font-mono">
                Pose Verification Checklist
              </span>
              <div className="space-y-1.5 text-xs text-slate-700">
                {item.fingerPositions.map((pos, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-blue-50/50 border border-blue-100">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <span>{pos}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tip */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Tip:</strong> {item.tips}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Close Practice
          </button>
          <button
            onClick={() => {
              onClose();
              onGoToTranslator();
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 shadow-sm transition active:scale-95"
          >
            <span>Launch Live Translator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
