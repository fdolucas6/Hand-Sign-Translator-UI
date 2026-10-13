/**
 * Types for Hand Sign Translator
 * American Sign Language (ASL) Fingerspelling & 63-Feature Pipeline
 */

export type ASLClass =
  | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
  | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T'
  | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z' | 'NO_SIGN';

export interface Landmark3D {
  x: number;
  y: number;
  z: number;
}

export interface HandLandmarkData {
  landmarks: Landmark3D[];
  handedness: 'Left' | 'Right';
  score: number;
}

export interface NormalizationResult {
  /** 63 normalized coordinates [x0, y0, z0, x1, y1, z1, ..., x20, y20, z20] */
  features: number[];
  wristOrigin: Landmark3D;
  scaleFactor: number;
  landmarksNormalized: Landmark3D[];
}

export interface PredictionRequest {
  landmarks: number[]; // 63 floats
  raw_landmarks?: Landmark3D[];
  handedness?: 'Left' | 'Right';
  timestamp?: number;
}

export interface PredictionResponse {
  sign: ASLClass;
  confidence: number; // 0.0 to 1.0
  class_id?: number;
  probabilities?: Record<string, number>;
  is_no_sign?: boolean;
  latency_ms?: number;
}

export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'error' | 'offline';

export interface ApiConnectionConfig {
  baseUrl: string;
  useWebSocket: boolean;
  pollingIntervalMs: number;
  confidenceThreshold: number; // 0.0 to 1.0 (e.g. 0.85)
  debounceFrameWindow: number; // e.g. 3 frames
}

export interface StageNode {
  id: string;
  stepNumber: string;
  category: string;
  title: string;
  description: string;
  iconName: string;
  tags: [string, string];
  detailData: {
    heading: string;
    description: string;
    metricLabel1: string;
    metricValue1: string;
    metricLabel2: string;
    metricValue2: string;
  };
}

export interface AlphabetGuideItem {
  letter: string;
  name: string;
  description: string;
  fingerPositions: string[];
  tips: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  palmOrientation: 'Forward' | 'Inward' | 'Sideways';
  confusedWith: string[];
  svgPath: string;
}

export type ActivePage = 'translator' | 'guide' | 'how-it-works' | 'about';
