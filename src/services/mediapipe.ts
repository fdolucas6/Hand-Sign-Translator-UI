/**
 * MediaPipe Hands Controller and Skeletal Rendering Engine
 * Handles webcam stream, 21 3D joint landmark extraction, and canvas overlay rendering.
 */

import { Landmark3D, HandLandmarkData } from '../types/asl';

import { HAND_CONNECTIONS, normalizeLandmarks } from './normalization';

declare global {
  interface Window {
    Hands?: any;
    Camera?: any;
  }
}

export interface LandmarkFrameResult {
  landmarks: Landmark3D[];
  rawFeatures63: number[];
  handedness: 'Left' | 'Right';
  score: number;
}

export class MediaPipeHandTracker {
  private handsInstance: any = null;
  private cameraInstance: any = null;
  private isInitialized = false;
  private isProcessing = false;
  private onLandmarksCallback: ((result: LandmarkFrameResult | null) => void) | null = null;

  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    // Check if window.Hands is ready or load dynamically
    if (typeof window === 'undefined') return false;

    if (!window.Hands) {
      await this.loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');
    }

    if (!window.Hands) {
      console.warn('[MediaPipe] Hands SDK could not be loaded from CDN');
      return false;
    }

    try {
      this.handsInstance = new window.Hands({
        locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      this.handsInstance.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.65,
        minTrackingConfidence: 0.6,
      });

      this.handsInstance.onResults((results: any) => {
        if (!this.onLandmarksCallback) return;

        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
          const rawLms = results.multiHandLandmarks[0];
          const handedness =
            results.multiHandedness && results.multiHandedness.length > 0
              ? results.multiHandedness[0].label
              : 'Right';
          const score =
            results.multiHandedness && results.multiHandedness.length > 0
              ? results.multiHandedness[0].score
              : 0.95;

          const landmarks: Landmark3D[] = rawLms.map((p: any) => ({
            x: p.x,
            y: p.y,
            z: p.z || 0,
          }));

          const norm = normalizeLandmarks(landmarks);

          this.onLandmarksCallback({
            landmarks,
            rawFeatures63: norm.features,
            handedness: handedness as 'Left' | 'Right',
            score,
          });
        } else {
          this.onLandmarksCallback(null);
        }
      });

      this.isInitialized = true;
      return true;
    } catch (e) {
      console.error('[MediaPipe] Failed to initialize hands', e);
      return false;
    }
  }

  private loadScript(src: string): Promise<boolean> {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }

  public onLandmarks(callback: (result: LandmarkFrameResult | null) => void): void {
    this.onLandmarksCallback = callback;
  }

  public async processVideoFrame(videoElement: HTMLVideoElement): Promise<void> {
    if (!this.isInitialized || !this.handsInstance || this.isProcessing) return;
    if (videoElement.readyState < 2) return;

    this.isProcessing = true;
    try {
      await this.handsInstance.send({ image: videoElement });
    } catch (err) {
      // transient frame drop
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Draws 21 skeletal joints and glowing connecting lines on canvas.
   */
  public drawSkeleton(
    ctx: CanvasRenderingContext2D,
    landmarks: Landmark3D[],
    width: number,
    height: number,
    options: {
      drawConnections?: boolean;
      drawNodes?: boolean;
      primaryColor?: string;
      jointColor?: string;
      mirror?: boolean;
    } = {}
  ): void {
    const {
      drawConnections = true,
      drawNodes = true,
      primaryColor = '#06b6d4', // Cyan vector line
      jointColor = '#ffffff',   // White glowing joints
      mirror = true,
    } = options;

    ctx.save();

    // Map normalized coordinates to canvas pixels
    const points = landmarks.map((lm) => {
      const x = mirror ? (1 - lm.x) * width : lm.x * width;
      const y = lm.y * height;
      return { x, y, z: lm.z };
    });

    // 1. Draw Connecting Bones
    if (drawConnections) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = primaryColor;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Soft glow
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = 8;

      HAND_CONNECTIONS.forEach(([startIndex, endIndex]) => {
        const p1 = points[startIndex];
        const p2 = points[endIndex];
        if (p1 && p2) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    }

    // 2. Draw 21 Articulator Joint Nodes
    if (drawNodes) {
      points.forEach((pt, index) => {
        ctx.beginPath();
        // Fingertip joints (4, 8, 12, 16, 20) are slightly larger
        const isFingertip = [4, 8, 12, 16, 20].includes(index);
        const radius = isFingertip ? 5 : 3.5;

        ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = isFingertip ? '#38bdf8' : jointColor;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        ctx.fill();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#090d16';
        ctx.stroke();
      });
    }

    ctx.restore();
  }

  public destroy(): void {
    if (this.cameraInstance) {
      try {
        this.cameraInstance.stop();
      } catch (e) {}
      this.cameraInstance = null;
    }
    if (this.handsInstance) {
      try {
        this.handsInstance.close();
      } catch (e) {}
      this.handsInstance = null;
    }
    this.isInitialized = false;
  }
}
