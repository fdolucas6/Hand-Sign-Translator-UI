/**
 * Web Speech Synthesis Service
 * Provides natural text-to-speech audio for translated fingerspelling text.
 */

export interface SpeechSettings {
  pitch: number;
  rate: number;
  volume: number;
  voiceURI?: string;
  autoSpeakLetters: boolean;
  autoSpeakWords: boolean;
}

const DEFAULT_SPEECH_SETTINGS: SpeechSettings = {
  pitch: 1.0,
  rate: 1.0,
  volume: 1.0,
  autoSpeakLetters: false,
  autoSpeakWords: true,
};

class SpeechService {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private settings: SpeechSettings = { ...DEFAULT_SPEECH_SETTINGS };
  private isSupported: boolean = false;
  private isSpeakingState: boolean = false;
  private listeners: Set<(isSpeaking: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    this.voices = this.synth.getVoices().filter((v) => v.lang.startsWith('en') || v.default);
    if (this.voices.length === 0) {
      this.voices = this.synth.getVoices();
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.voices;
  }

  public getSettings(): SpeechSettings {
    return { ...this.settings };
  }

  public updateSettings(newSettings: Partial<SpeechSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
  }

  public onSpeakingChange(cb: (isSpeaking: boolean) => void): () => void {
    this.listeners.add(cb);
    cb(this.isSpeakingState);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private setSpeaking(state: boolean): void {
    this.isSpeakingState = state;
    this.listeners.forEach((cb) => cb(this.isSpeakingState));
  }

  public speak(text: string, options?: Partial<SpeechSettings>): void {
    if (!this.synth || !this.isSupported) {
      console.warn('SpeechSynthesis is not supported on this browser/platform');
      return;
    }

    const trimmed = text.trim();
    if (!trimmed) return;

    // Cancel ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(trimmed);
    const cfg = { ...this.settings, ...options };

    utterance.pitch = Math.max(0.5, Math.min(2.0, cfg.pitch));
    utterance.rate = Math.max(0.5, Math.min(2.0, cfg.rate));
    utterance.volume = Math.max(0.0, Math.min(1.0, cfg.volume));

    if (cfg.voiceURI) {
      const selected = this.voices.find((v) => v.voiceURI === cfg.voiceURI);
      if (selected) {
        utterance.voice = selected;
      }
    }

    utterance.onstart = () => {
      this.setSpeaking(true);
    };

    utterance.onend = () => {
      this.setSpeaking(false);
    };

    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      this.setSpeaking(false);
    };

    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.setSpeaking(false);
    }
  }

  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }
}

export const speechService = new SpeechService();
