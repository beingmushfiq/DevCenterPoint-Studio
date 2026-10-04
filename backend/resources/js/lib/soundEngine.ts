/**
 * Precision Web Audio API Sound & Haptic Synthesizer
 * Generates zero-latency mechanical, pneumatic, and tactile soundscapes
 * without requiring external audio assets.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  private volume: number = 0.7;
  private tonePreset: 'ethereal' | 'deep_tech' | 'cyber' = 'ethereal';

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('dcp_sound_muted');
      this.muted = savedMute === 'true';
      const savedVol = localStorage.getItem('dcp_sound_volume');
      if (savedVol) this.volume = parseFloat(savedVol) || 0.7;
      const savedTone = localStorage.getItem('dcp_sound_tone') as 'ethereal' | 'deep_tech' | 'cyber';
      if (savedTone) this.tonePreset = savedTone;
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  public isSoundMuted(): boolean {
    return this.muted;
  }

  public setSoundMuted(muted: boolean): void {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dcp_sound_muted', muted ? 'true' : 'false');
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0.1, Math.min(1.0, vol));
    if (typeof window !== 'undefined') {
      localStorage.setItem('dcp_sound_volume', this.volume.toString());
    }
  }

  public getTonePreset(): 'ethereal' | 'deep_tech' | 'cyber' {
    return this.tonePreset;
  }

  public setTonePreset(preset: 'ethereal' | 'deep_tech' | 'cyber'): void {
    this.tonePreset = preset;
    if (typeof window !== 'undefined') {
      localStorage.setItem('dcp_sound_tone', preset);
    }
    this.playPresetChord(preset);
  }

  /**
   * Harmonically tuned chord playback for tone presets
   */
  public playPresetChord(preset: 'ethereal' | 'deep_tech' | 'cyber' = this.tonePreset): void {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(this.volume * 0.12, now);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
    masterGain.connect(ctx.destination);

    let freqs: number[] = [523.25, 659.25, 783.99]; // C5, E5, G5
    let type: OscillatorType = 'sine';

    if (preset === 'deep_tech') {
      freqs = [130.81, 196.0, 261.63]; // C3, G3, C4
      type = 'triangle';
    } else if (preset === 'cyber') {
      freqs = [440.0, 659.25, 880.0]; // A4, E5, A5
      type = 'sawtooth';
    }

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);
      oscGain.gain.setValueAtTime(0.001, now + idx * 0.04);
      oscGain.gain.linearRampToValueAtTime(0.4 / freqs.length, now + idx * 0.04 + 0.03);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start(now + idx * 0.04);
      osc.stop(now + 0.45);
    });
  }

  public toggleMute(): boolean {
    this.setSoundMuted(!this.muted);
    return this.muted;
  }

  /**
   * Haptic vibration feedback for supported devices
   */
  public haptic(pattern: number | number[] = 15): void {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore vibration errors if blocked by browser policy
      }
    }
  }

  /**
   * Soothing, smooth dropdown slide-down sound sequence:
   * 1. Gentle tactile micro-haptic
   * 2. Soft, warm harmonic pneumatic slide (airy & calming)
   * 3. Succeeded by playShutterCompleteClick on finish
   */
  public playShutterDownSequence(): void {
    if (this.muted) {
      this.haptic(10);
      return;
    }

    const ctx = this.getContext();
    if (!ctx) {
      this.haptic(10);
      return;
    }

    const now = ctx.currentTime;

    // Gentle tactile micro-tap
    this.haptic(8);

    // Soft warm harmonic glide (soothing sine wave sliding gently)
    const sweepOsc = ctx.createOscillator();
    const sweepGain = ctx.createGain();
    sweepOsc.type = 'sine';
    sweepOsc.frequency.setValueAtTime(460, now);
    sweepOsc.frequency.exponentialRampToValueAtTime(260, now + 0.22);

    sweepGain.gain.setValueAtTime(0.001, now);
    sweepGain.gain.linearRampToValueAtTime(0.08, now + 0.04);
    sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    sweepOsc.connect(sweepGain);
    sweepGain.connect(ctx.destination);
    sweepOsc.start(now);
    sweepOsc.stop(now + 0.26);

    // Soft airy whisper / soothing curtain glide (filtered pink noise)
    const bufferSize = Math.floor(ctx.sampleRate * 0.22);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.05;
      b1 = 0.96300 * b1 + white * 0.11;
      b2 = 0.57000 * b2 + white * 0.55;
      output[i] = (b0 + b1 + b2) * 0.15;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(700, now);
    filter.frequency.exponentialRampToValueAtTime(250, now + 0.22);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.001, now);
    noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.05);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.23);

    noiseSource.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(now);
    noiseSource.stop(now + 0.24);
  }

  /**
   * Subtle mechanical 'click' audio cue triggered specifically when
   * the shutter-down theme transition finishes unveiling the new theme.
   * Synthesized using dual-filtered micro-oscillators with fast exponential decay.
   */
  public playShutterCompleteClick(): void {
    // Subtle tactile haptic tap on finish
    this.haptic(10);

    if (this.muted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Component 1: Precision metallic tick (high-frequency crisp transient)
    const tickOsc = ctx.createOscillator();
    const tickGain = ctx.createGain();
    tickOsc.type = 'triangle';
    tickOsc.frequency.setValueAtTime(2600, now);
    tickOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.018);

    tickGain.gain.setValueAtTime(0.13, now);
    tickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

    tickOsc.connect(tickGain);
    tickGain.connect(ctx.destination);
    tickOsc.start(now);
    tickOsc.stop(now + 0.02);

    // Component 2: Subtle acoustic body settle (sub-warmth mechanical detent)
    const bodyOsc = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    bodyOsc.type = 'sine';
    bodyOsc.frequency.setValueAtTime(750, now + 0.002);
    bodyOsc.frequency.exponentialRampToValueAtTime(260, now + 0.028);

    bodyGain.gain.setValueAtTime(0.11, now + 0.002);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

    bodyOsc.connect(bodyGain);
    bodyGain.connect(ctx.destination);
    bodyOsc.start(now + 0.002);
    bodyOsc.stop(now + 0.03);
  }

  /**
   * Crisp tactile button click feedback
   */
  public playClick(): void {
    this.haptic(8);
    if (this.muted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.022);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  /**
   * Delicate micro-pop for chips, category pills, filter tabs, and option toggles
   */
  public playTap(): void {
    this.haptic(6);
    if (this.muted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(700, now + 0.016);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.016);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.02);
  }

  /**
   * Expanding pneumatic swell when opening a modal or expanding an architecture deep-dive
   */
  public playModalOpen(): void {
    this.haptic([10, 20]);
    if (this.muted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.14);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  /**
   * Descending gentle dismiss sound when closing a modal or backdrop
   */
  public playModalClose(): void {
    this.haptic(8);
    if (this.muted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  /**
   * Affirmative double-tick chirp for copy-to-clipboard actions
   */
  public playCopySuccess(): void {
    this.haptic([8, 30, 10]);
    if (this.muted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First micro-chirp
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1200, now);
    osc1.frequency.exponentialRampToValueAtTime(1800, now + 0.025);
    gain1.gain.setValueAtTime(0.09, now);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.03);

    // Second affirmative chirp (higher pitch)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1800, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(2600, now + 0.085);
    gain2.gain.setValueAtTime(0.11, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.085);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.09);
  }

  /**
   * Uplifting harmonic chime sequence (3-tone major triad)
   * Triggered on successful brief submission and major milestones
   */
  public playSuccessChime(): void {
    this.haptic([15, 40, 20]);
    if (this.muted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [
      { freq: 587.33, time: 0 },       // D5
      { freq: 739.99, time: 0.09 },    // F#5
      { freq: 880.00, time: 0.18 },    // A5
      { freq: 1174.66, time: 0.28 },   // D6
    ];

    notes.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.001, now + time);
      gain.gain.linearRampToValueAtTime(0.12, now + time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + time + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + time);
      osc.stop(now + time + 0.48);
    });
  }

  /**
   * Alias for playSuccessChime
   */
  public playSuccess(): void {
    this.playSuccessChime();
  }

  /**
   * Shimmering cascade sparkle sound for replaying celebrations
   */
  public playSparkleCelebration(): void {
    this.haptic([10, 30, 10, 30, 15]);
    if (this.muted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const pitches = [1320, 1580, 1760, 2093, 2637];

    pitches.forEach((freq, idx) => {
      const startTime = now + idx * 0.045;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, startTime + 0.06);

      gain.gain.setValueAtTime(0.07, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.13);
    });
  }

  /**
   * Mobile navigation menu drawer toggle sound
   */
  public playMenuToggle(open: boolean): void {
    this.haptic(10);
    if (this.muted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (open) {
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.08);
    } else {
      osc.frequency.setValueAtTime(640, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);
    }

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  /**
   * Light ascending airy sweep for scroll-to-top interaction
   */
  public playScrollTop(): void {
    this.haptic(12);
    if (this.muted) return;

    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.16);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  }
}

export const soundEngine = new SoundEngine();
