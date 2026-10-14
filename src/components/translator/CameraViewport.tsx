import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Camera, CameraOff, RefreshCw, FlipHorizontal, Eye, 
  EyeOff, Play, Pause, AlertCircle, ShieldAlert 
} from 'lucide-react';
import { MediaPipeHandTracker, LandmarkFrameResult } from '../../services/mediapipe';
import { DetectionPill } from './DetectionPill';
import { ASLClass } from '../../types/asl';

interface CameraViewportProps {
  onLandmarksExtracted: (result: LandmarkFrameResult | null) => void;
  detectedSign: ASLClass | null;
  confidence: number;
  isStable: boolean;
  stabilityProgress: number;
  latencyMs: number;
  isBackendConnected: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
}

export const CameraViewport: React.FC<CameraViewportProps> = ({
  onLandmarksExtracted,
  detectedSign,
  confidence,
  isStable,
  stabilityProgress,
  latencyMs,
  isBackendConnected,
  isPaused,
  onTogglePause,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trackerRef = useRef<MediaPipeHandTracker | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isMirrored, setIsMirrored] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [showReticle, setShowReticle] = useState(true);

  // Telemetry metrics
  const [fps, setFps] = useState<number>(30);
  const [resolution, setResolution] = useState<{ width: number; height: number }>({ width: 640, height: 480 });
  const [hasHand, setHasHand] = useState(false);

  // Mutable refs to prevent tracker teardown/re-creation on UI state changes
  const onLandmarksExtractedRef = useRef(onLandmarksExtracted);
  const showSkeletonRef = useRef(showSkeleton);
  const isMirroredRef = useRef(isMirrored);
  const isStableRef = useRef(isStable);

  useEffect(() => {
    onLandmarksExtractedRef.current = onLandmarksExtracted;
  }, [onLandmarksExtracted]);

  useEffect(() => {
    showSkeletonRef.current = showSkeleton;
  }, [showSkeleton]);

  useEffect(() => {
    isMirroredRef.current = isMirrored;
  }, [isMirrored]);

  useEffect(() => {
    isStableRef.current = isStable;
  }, [isStable]);

  // Setup tracker instance once on mount
  useEffect(() => {
    const tracker = new MediaPipeHandTracker();
    trackerRef.current = tracker;

    tracker.initialize().then((success) => {
      if (!success) {
        console.warn('MediaPipe initialization fallback active');
      }
    });

    tracker.onLandmarks((result) => {
      setHasHand(!!result);
      onLandmarksExtractedRef.current(result);

      // Render skeletal lines onto canvas overlay
      const canvas = canvasRef.current;
      if (canvas && result && showSkeletonRef.current) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          tracker.drawSkeleton(ctx, result.landmarks, canvas.width, canvas.height, {
            mirror: isMirroredRef.current,
            primaryColor: isStableRef.current ? '#10b981' : '#06b6d4',
            jointColor: '#ffffff',
          });
        }
      } else if (canvas && !result) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    });

    return () => {
      tracker.destroy();
      trackerRef.current = null;
    };
  }, []);

  // Request camera stream
  const startCamera = useCallback(async (deviceId?: string) => {
    try {
      setErrorMessage(null);

      // Enumerate devices if possible
      if (navigator.mediaDevices?.enumerateDevices) {
        try {
          const devs = await navigator.mediaDevices.enumerateDevices();
          const videoDevs = devs.filter((d) => d.kind === 'videoinput');
          setDevices(videoDevs);
        } catch (e) {}
      }

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 640, max: 1280 },
          height: { ideal: 480, max: 720 },
          facingMode: deviceId ? undefined : 'user',
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setHasPermission(true);

        const track = stream.getVideoTracks()[0];
        const settings = track.getSettings();
        if (settings.width && settings.height) {
          setResolution({ width: settings.width, height: settings.height });
        }
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setHasPermission(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera access was denied. Please allow camera permissions in your browser bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera hardware detected on this device.');
      } else {
        setErrorMessage(`Failed to start camera: ${err.message || 'Unknown error'}`);
      }
    }
  }, []);

  useEffect(() => {
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [startCamera]);

  // Frame processing loop
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const processLoop = () => {
      if (!isPaused && videoRef.current && videoRef.current.readyState >= 2 && trackerRef.current) {
        trackerRef.current.processVideoFrame(videoRef.current);

        // Compute FPS
        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
          setFps(Math.round((frameCount * 1000) / (now - lastTime)));
          frameCount = 0;
          lastTime = now;
        }
      }

      animationFrameRef.current = requestAnimationFrame(processLoop);
    };

    animationFrameRef.current = requestAnimationFrame(processLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused]);

  // Resize canvas overlay to match video resolution
  const handleVideoLoadedMetadata = () => {
    if (videoRef.current && canvasRef.current) {
      const vWidth = videoRef.current.videoWidth || 640;
      const vHeight = videoRef.current.videoHeight || 480;
      canvasRef.current.width = vWidth;
      canvasRef.current.height = vHeight;
      setResolution({ width: vWidth, height: vHeight });
    }
  };

  return (
    <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] bg-[#090D16] rounded-2xl overflow-hidden shadow-xl border border-slate-800 flex items-center justify-center select-none group">
      {/* Video Element */}
      <video
        ref={videoRef}
        playsInline
        muted
        onLoadedMetadata={handleVideoLoadedMetadata}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isMirrored ? 'scale-x-[-1]' : ''
        } ${isPaused ? 'opacity-40 grayscale' : 'opacity-90'}`}
      />

      {/* Canvas for Skeletal Joints Overlay */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none z-10"
      />

      {/* Hand-Placement Alignment Reticle */}
      {showReticle && !isPaused && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          <div className="w-56 h-72 sm:w-64 sm:h-80 rounded-3xl border-2 border-dashed border-cyan-400/30 flex flex-col items-center justify-between p-4 transition-all">
            <span className="text-[10px] font-mono text-cyan-300/60 uppercase tracking-widest bg-slate-950/40 px-2 py-0.5 rounded backdrop-blur-xs">
              Hand Reticle
            </span>
            <span className="text-[10px] font-mono text-cyan-300/40 text-center max-w-[140px]">
              Align palm within boundary
            </span>
          </div>
        </div>
      )}

      {/* Top Floating Bar: Controls & Detection Pill */}
      <div className="absolute top-3 inset-x-3 z-20 flex items-start justify-between gap-2 pointer-events-none">
        {/* Device Select & Mirror */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-950/70 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/60 text-white text-xs shadow-md">
          <button
            onClick={() => setIsMirrored(!isMirrored)}
            title="Mirror camera horizontal"
            className={`p-1.5 rounded-lg transition ${
              isMirrored ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>

          {devices.length > 1 && (
            <select
              value={selectedDeviceId}
              onChange={(e) => {
                setSelectedDeviceId(e.target.value);
                startCamera(e.target.value);
              }}
              className="bg-transparent text-slate-200 text-xs px-2 py-1 outline-none cursor-pointer max-w-[120px] truncate"
            >
              {devices.map((dev, i) => (
                <option key={dev.deviceId || i} value={dev.deviceId} className="bg-slate-900 text-white">
                  {dev.label || `Camera ${i + 1}`}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => startCamera(selectedDeviceId)}
            title="Reload Camera"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Anchored Detection Pill */}
        <div className="pointer-events-auto">
          <DetectionPill
            detectedSign={detectedSign}
            confidence={confidence}
            isStable={isStable}
            stabilityProgress={stabilityProgress}
            latencyMs={latencyMs}
            hasHand={hasHand}
            isBackendConnected={isBackendConnected}
          />
        </div>
      </div>

      {/* Bottom Floating Telemetry Strip */}
      <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Telemetry Stats */}
        <div className="bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-3 shadow-md pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${hasHand ? 'bg-cyan-400 animate-pulse' : 'bg-slate-500'}`} />
            <span>{hasHand ? '21 Joints (3D)' : 'No Hand'}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span>{fps} FPS</span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-slate-400 hidden sm:inline">{resolution.width}×{resolution.height}</span>
        </div>

        {/* Viewport Toggles (Skeleton, Reticle, Pause) */}
        <div className="bg-slate-950/75 backdrop-blur-md p-1 rounded-xl border border-slate-800 text-white flex items-center gap-1 shadow-md pointer-events-auto">
          <button
            onClick={() => setShowSkeleton(!showSkeleton)}
            title={showSkeleton ? 'Hide skeleton overlay' : 'Show skeleton overlay'}
            className={`p-1.5 rounded-lg text-xs transition ${
              showSkeleton ? 'text-cyan-400 bg-cyan-950/60' : 'text-slate-400 hover:text-white'
            }`}
          >
            {showSkeleton ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>

          <button
            onClick={onTogglePause}
            title={isPaused ? 'Resume video stream (Space)' : 'Pause video stream (Space)'}
            className={`p-1.5 rounded-lg text-xs transition ${
              isPaused ? 'text-amber-400 bg-amber-950/60' : 'text-slate-400 hover:text-white'
            }`}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Permission Denied / Error Overlay */}
      {hasPermission === false && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center">
            <CameraOff className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-white font-heading">
              Camera Access Required
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              {errorMessage || 'Please permit camera access in your browser to extract 21 3D hand landmarks for real-time sign translation.'}
            </p>
          </div>
          <button
            onClick={() => startCamera()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Camera Access</span>
          </button>
        </div>
      )}

      {/* Paused State Overlay Banner */}
      {isPaused && hasPermission && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-slate-950/80 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl text-white text-xs font-semibold flex items-center gap-2">
            <Pause className="w-4 h-4 text-amber-400" />
            <span>Capture Paused (Press Space to Resume)</span>
          </div>
        </div>
      )}
    </div>
  );
};
