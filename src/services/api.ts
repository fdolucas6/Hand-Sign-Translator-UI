/**
 * API Service for FastAPI ML Backend
 * Handles real-time communication with the user's Python FastAPI inference server.
 * Never fabricates mock predictions. Reports genuine connection and error states.
 */

import { ApiConnectionConfig, ConnectionStatus, Landmark3D, PredictionResponse } from '../types/asl';

const DEFAULT_CONFIG: ApiConnectionConfig = {
  baseUrl: (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000',
  useWebSocket: false,
  pollingIntervalMs: 50,
  confidenceThreshold: 0.70,
  debounceFrameWindow: 5,
};

const STORAGE_KEY = 'asl_translator_api_config';

export function loadSavedApiConfig(): ApiConnectionConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // fallback to defaults
  }
  return DEFAULT_CONFIG;
}

export function saveApiConfig(config: ApiConnectionConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
}

export interface ApiTelemetryLog {
  timestamp: number;
  url: string;
  method: string;
  requestPayloadSize: number;
  status: number | 'FAIL';
  latencyMs: number;
  responsePreview?: string;
  error?: string;
}

class FastApiService {
  private config: ApiConnectionConfig = loadSavedApiConfig();
  private status: ConnectionStatus = 'idle';
  private lastPingMs: number | null = null;
  private lastError: string | null = null;
  private ws: WebSocket | null = null;
  private wsListeners: Set<(data: PredictionResponse) => void> = new Set();
  private statusListeners: Set<(status: ConnectionStatus, latency: number | null, error: string | null) => void> = new Set();
  private telemetryLogs: ApiTelemetryLog[] = [];

  constructor() {
    // Test initial connectivity asynchronously
    this.checkHealth().catch(() => {});
  }

  public getConfig(): ApiConnectionConfig {
    return { ...this.config };
  }

  public setConfig(newConfig: Partial<ApiConnectionConfig>): void {
    this.config = { ...this.config, ...newConfig };
    saveApiConfig(this.config);
    // Re-check health with new config
    this.checkHealth();
  }

  public onStatusChange(callback: (status: ConnectionStatus, latency: number | null, error: string | null) => void): () => void {
    this.statusListeners.add(callback);
    callback(this.status, this.lastPingMs, this.lastError);
    return () => {
      this.statusListeners.delete(callback);
    };
  }

  private updateStatus(newStatus: ConnectionStatus, latency: number | null = null, error: string | null = null): void {
    this.status = newStatus;
    if (latency !== null) this.lastPingMs = latency;
    this.lastError = error;
    this.statusListeners.forEach((cb) => cb(this.status, this.lastPingMs, this.lastError));
  }

  public getTelemetryLogs(): ApiTelemetryLog[] {
    return [...this.telemetryLogs];
  }

  private addTelemetryLog(log: ApiTelemetryLog): void {
    this.telemetryLogs.unshift(log);
    if (this.telemetryLogs.length > 50) {
      this.telemetryLogs.pop();
    }
  }

  /**
   * Genuine Health Check to FastAPI server.
   * Expects GET /health or GET / returning 200 OK.
   */
  public async checkHealth(): Promise<{ ok: boolean; latency: number; details?: any; error?: string }> {
    const t0 = performance.now();
    const cleanUrl = this.config.baseUrl.replace(/\/+$/, '');
    const healthUrl = `${cleanUrl}/health`;

    this.updateStatus('connecting');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      let response: Response;
      try {
        response = await fetch(healthUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
      } catch (err: any) {
        // Fallback to GET / root if /health is not defined
        response = await fetch(cleanUrl, {
          method: 'GET',
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });
      } finally {
        clearTimeout(timeoutId);
      }

      const latency = Math.round(performance.now() - t0);

      if (response.ok) {
        let data: any = {};
        try {
          data = await response.json();
        } catch {
          data = { status: 'ok' };
        }

        this.updateStatus('connected', latency, null);
        this.addTelemetryLog({
          timestamp: Date.now(),
          url: healthUrl,
          method: 'GET',
          requestPayloadSize: 0,
          status: response.status,
          latencyMs: latency,
          responsePreview: JSON.stringify(data).slice(0, 100),
        });

        return { ok: true, latency, details: data };
      } else {
        const errorMsg = `Server returned HTTP ${response.status} (${response.statusText})`;
        this.updateStatus('error', latency, errorMsg);
        return { ok: false, latency, error: errorMsg };
      }
    } catch (err: any) {
      const latency = Math.round(performance.now() - t0);
      const isAbort = err.name === 'AbortError';
      const errorMsg = isAbort
        ? 'Connection timed out (no response within 3.5s)'
        : `Cannot reach FastAPI at ${cleanUrl}. Ensure server is running with CORS enabled.`;

      this.updateStatus('offline', latency, errorMsg);
      this.addTelemetryLog({
        timestamp: Date.now(),
        url: healthUrl,
        method: 'GET',
        requestPayloadSize: 0,
        status: 'FAIL',
        latencyMs: latency,
        error: errorMsg,
      });

      return { ok: false, latency, error: errorMsg };
    }
  }

  /**
   * Real Predict Call: dispatches the 63-dimensional normalized features array to FastAPI.
   * If backend is offline or fails, returns null and updates connection state.
   * Never generates mock data.
   */
  public async predict(
    features63: number[],
    rawLandmarks?: Landmark3D[],
    handedness: 'Left' | 'Right' = 'Right'
  ): Promise<PredictionResponse | null> {
    if (features63.length !== 63) {
      console.warn(`[FastAPI Service] Invalid feature count: expected 63, got ${features63.length}`);
      return null;
    }

    const t0 = performance.now();
    const cleanUrl = this.config.baseUrl.replace(/\/+$/, '');
    const predictUrl = `${cleanUrl}/predict`;

    const payload = {
      landmarks: features63,
      raw_landmarks: rawLandmarks,
      handedness: handedness,
      timestamp: Date.now(),
    };

    const payloadString = JSON.stringify(payload);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch(predictUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: payloadString,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const roundTripMs = Math.round(performance.now() - t0);

      if (!response.ok) {
        const errorText = await response.text();
        const errorMsg = `HTTP ${response.status}: ${errorText || response.statusText}`;
        this.updateStatus('error', roundTripMs, errorMsg);
        this.addTelemetryLog({
          timestamp: Date.now(),
          url: predictUrl,
          method: 'POST',
          requestPayloadSize: payloadString.length,
          status: response.status,
          latencyMs: roundTripMs,
          error: errorMsg,
        });
        return null;
      }

      const data = await response.json();
      const prediction: PredictionResponse = {
        sign: data.sign || data.prediction || data.letter || 'NO_SIGN',
        confidence: typeof data.confidence === 'number' ? data.confidence : 0,
        class_id: data.class_id,
        probabilities: data.probabilities || data.raw_probabilities,
        is_no_sign: data.sign === 'NO_SIGN' || data.is_no_sign === true,
        latency_ms: data.latency_ms || roundTripMs,
      };

      this.updateStatus('connected', roundTripMs, null);
      this.addTelemetryLog({
        timestamp: Date.now(),
        url: predictUrl,
        method: 'POST',
        requestPayloadSize: payloadString.length,
        status: response.status,
        latencyMs: roundTripMs,
        responsePreview: JSON.stringify(prediction),
      });

      return prediction;
    } catch (err: any) {
      const roundTripMs = Math.round(performance.now() - t0);
      const isAbort = err.name === 'AbortError';
      const errorMsg = isAbort ? 'Inference request timed out' : `Connection failed: ${err.message || 'Network error'}`;

      this.updateStatus('offline', roundTripMs, errorMsg);
      this.addTelemetryLog({
        timestamp: Date.now(),
        url: predictUrl,
        method: 'POST',
        requestPayloadSize: payloadString.length,
        status: 'FAIL',
        latencyMs: roundTripMs,
        error: errorMsg,
      });

      return null;
    }
  }

  /**
   * WebSocket client for continuous bi-directional streaming inference.
   */
  public connectWebSocket(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      const wsUrl = this.config.baseUrl.replace(/^http/, 'ws').replace(/\/+$/, '') + '/ws/predict';
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.updateStatus('connected', 5, null);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const result: PredictionResponse = {
            sign: data.sign || data.prediction || 'NO_SIGN',
            confidence: data.confidence || 0,
            is_no_sign: data.sign === 'NO_SIGN',
            latency_ms: data.latency_ms,
            probabilities: data.probabilities,
          };
          this.wsListeners.forEach((listener) => listener(result));
        } catch (e) {
          console.error('[WebSocket] Failed to parse message', e);
        }
      };

      this.ws.onerror = () => {
        this.updateStatus('offline', null, 'WebSocket connection failed');
      };

      this.ws.onclose = () => {
        this.ws = null;
      };
    } catch (e: any) {
      this.updateStatus('offline', null, e.message);
    }
  }

  public sendWebSocketFrame(features63: number[]): boolean {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ landmarks: features63, timestamp: Date.now() }));
      return true;
    }
    return false;
  }

  public onWebSocketPrediction(listener: (data: PredictionResponse) => void): () => void {
    this.wsListeners.add(listener);
    return () => {
      this.wsListeners.delete(listener);
    };
  }

  public disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const fastApiService = new FastApiService();
