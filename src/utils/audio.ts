import {
  BEEP_HIGH_PITCH_FREQUENCY_HZ,
  BEEP_LOW_PITCH_FREQUENCY_HZ,
  BEEP_HIGH_PITCH_DURATION_MS,
  BEEP_LOW_PITCH_DURATION_MS,
  BEEP_VOLUME,
} from "../constants/constants";

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized && this.audioContext) {
      return;
    }

    try {
      this.audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
    }
  }

  private async ensureInitialized(): Promise<AudioContext | null> {
    if (!this.isInitialized || !this.audioContext) {
      await this.initialize();
    }

    if (this.audioContext?.state === "suspended") {
      await this.audioContext.resume();
    }

    return this.audioContext;
  }

  async playBeep(
    frequency: number,
    durationMs: number,
    volume: number = BEEP_VOLUME
  ): Promise<void> {
    const context = await this.ensureInitialized();
    if (!context) {
      return;
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, context.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      context.currentTime + durationMs / 1000
    );

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + durationMs / 1000);
  }

  async playHighPitchBeep(): Promise<void> {
    await this.playBeep(
      BEEP_HIGH_PITCH_FREQUENCY_HZ,
      BEEP_HIGH_PITCH_DURATION_MS
    );
  }

  async playLowPitchBeep(): Promise<void> {
    await this.playBeep(
      BEEP_LOW_PITCH_FREQUENCY_HZ,
      BEEP_LOW_PITCH_DURATION_MS
    );
  }
}

export const audioEngine = new AudioEngine();
