// Web Audio API Sound Generator & Thor Neural Human-Like Voice Engine for Thor Platform
// Synthesizes thunder rumbles, lightning cracks, runic chimes, and real human-like aged muscular kingly voice audio.

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isVoiceMuted: boolean = false;
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCache: Map<string, string> = new Map();
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('thor_audio_muted');
      this.isMuted = savedMute === 'true';

      const savedVoice = localStorage.getItem('thor_voice_muted');
      this.isVoiceMuted = savedVoice === 'true';

      if ('speechSynthesis' in window) {
        this.cachedVoices = window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
          this.cachedVoices = window.speechSynthesis.getVoices();
        };
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('thor_audio_muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public toggleVoice(): boolean {
    this.isVoiceMuted = !this.isVoiceMuted;
    if (this.isVoiceMuted) {
      this.stopThorSpeech();
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('thor_voice_muted', String(this.isVoiceMuted));
    }
    return this.isVoiceMuted;
  }

  public getIsVoiceMuted(): boolean {
    return this.isVoiceMuted;
  }

  // Play a booming thunder rumble with a sharp initial crack
  public playThunder() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // 1. Initial sharp crack (White noise transient)
      const bufferSize = this.ctx.sampleRate * 0.15;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.15);

      const crackGain = this.ctx.createGain();
      crackGain.gain.setValueAtTime(0.35, now);
      crackGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      whiteNoise.connect(filter);
      filter.connect(crackGain);
      crackGain.connect(this.ctx.destination);
      whiteNoise.start(now);

      // 2. Rolling deep sub-bass thunder rumble
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const rumbleGain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(75, now);
      osc1.frequency.exponentialRampToValueAtTime(32, now + 1.8);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(55, now);
      osc2.frequency.exponentialRampToValueAtTime(25, now + 2.2);

      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(140, now);
      rumbleFilter.frequency.exponentialRampToValueAtTime(50, now + 2.2);

      rumbleGain.gain.setValueAtTime(0.01, now);
      rumbleGain.gain.linearRampToValueAtTime(0.4, now + 0.08);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);

      osc1.connect(rumbleFilter);
      osc2.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.5);
      osc2.stop(now + 2.5);
    } catch {
      // AudioContext policy handled gracefully
    }
  }

  // Play a crystalline Norse runic chime
  public playRunicChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [528, 660, 792];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 1.3);
      });
    } catch {
      // AudioContext policy handled gracefully
    }
  }

  // Play a soft lightning spark tone for chat messages
  public playMessageSpark() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // AudioContext policy handled gracefully
    }
  }

  // Sub-bass resonant undertone to give Thor's speech an aged, muscular, heavy resonance
  public playThorChestResonance() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.8);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(90, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch {}
  }

  // Find fallback deep male voice in browser
  private getAgedMasculineVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

    const voices =
      this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();

    if (!voices || voices.length === 0) return null;

    const preferredMaleVoices = [
      'microsoft david',
      'microsoft george',
      'microsoft ryan',
      'microsoft mark',
      'google uk english male',
      'daniel',
      'alex',
      'fred',
    ];

    for (const pref of preferredMaleVoices) {
      const match = voices.find((v) => v.name.toLowerCase().includes(pref));
      if (match) return match;
    }

    const maleVoice = voices.find(
      (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')
    );
    if (maleVoice) return maleVoice;

    const anyEnglish = voices.find((v) => v.lang.startsWith('en'));
    return anyEnglish || voices[0] || null;
  }

  /**
   * Speak text in Thor's aged, muscular, commanding god-of-thunder voice:
   * Uses ultra-realistic neural speech API (ChristopherNeural) with natural inflection,
   * with seamless fallback to client speech synthesis.
   */
  public async speakThor(
    text: string,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<boolean> {
    if (typeof window === 'undefined') return false;
    if (this.isVoiceMuted || this.isMuted) return false;

    this.stopThorSpeech();

    const cleanText = text
      .replace(/⚡/g, '')
      .replace(/[*_#`~[\]()]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    if (!cleanText) return false;

    // 1. Try Ultra-Realistic Neural MP3 Voice via /api/tts
    try {
      let audioUrl = this.audioCache.get(cleanText);

      if (!audioUrl) {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            voice: 'en-US-ChristopherNeural',
            pitch: '-14Hz',
            rate: '-6%',
          }),
        });

        if (res.ok) {
          const blob = await res.blob();
          audioUrl = URL.createObjectURL(blob);
          this.audioCache.set(cleanText, audioUrl);
        }
      }

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        audio.onplay = () => {
          this.playThorChestResonance();
          if (onStart) onStart();
        };

        audio.onended = () => {
          this.currentAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          this.currentAudio = null;
          if (onEnd) onEnd();
        };

        await audio.play();
        return true;
      }
    } catch (err) {
      console.warn('Neural TTS failed, falling back to client synthesis:', err);
    }

    // 2. Fallback to Browser Speech Synthesis if network is unavailable
    if ('speechSynthesis' in window) {
      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voice = this.getAgedMasculineVoice();
        if (voice) utterance.voice = voice;
        utterance.pitch = 0.62;
        utterance.rate = 0.88;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          this.playThorChestResonance();
          if (onStart) onStart();
        };
        utterance.onend = () => {
          this.currentUtterance = null;
          if (onEnd) onEnd();
        };
        utterance.onerror = () => {
          this.currentUtterance = null;
          if (onEnd) onEnd();
        };

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
        return true;
      } catch (e) {
        console.warn('Client speech synthesis error:', e);
      }
    }

    return false;
  }

  /**
   * Stop any ongoing speech immediately
   */
  public stopThorSpeech() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    if (this.currentAudio && !this.currentAudio.paused) {
      return true;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking;
    }
    return false;
  }

  public getCurrentUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }
}

export const soundManager = new SoundManager();
