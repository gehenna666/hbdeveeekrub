"use client";

// Web Audio API Sound Engine for 100% Reliable Playback without external asset dependencies
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Cute bubbly pop sound for keypad presses and button clicks
 */
export function playPopSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const now = ctx.currentTime;
    const startFreq = 420 + Math.random() * 60;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 1.8, now + 0.08);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Graceful fallback
  }
}

/**
 * Magical sparkle chime for heart tracing and love rewards
 */
export function playSparkleSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C5, E5, G5, B5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.12, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.35);
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Gentle breath whoosh + bell sound for blowing out birthday candles
 */
export function playCandleBlowSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(600, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start();

    // Soft chime after blow
    setTimeout(() => {
      playSparkleSound();
    }, 250);
  } catch {
    // Graceful fallback
  }
}

/**
 * Joyful success chime when passcode is unlocked or stage completes
 */
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const chords = [
      { freq: 523.25, time: 0.0 },  // C5
      { freq: 659.25, time: 0.1 },  // E5
      { freq: 783.99, time: 0.2 },  // G5
      { freq: 1046.5, time: 0.3 },  // C6
      { freq: 1318.5, time: 0.45 }, // E6
    ];
    const now = ctx.currentTime;

    chords.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0.18, now + time);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + 0.5);
    });
  } catch {
    // Graceful fallback
  }
}

/**
 * Realistic metallic key insertion sound with slide and lock engage
 */
export function playKeyInsertSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Metallic slide friction
    const bufferSize = Math.floor(ctx.sampleRate * 0.12);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.3 * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3200, now);
    filter.Q.setValueAtTime(3, now);
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(now);

    // High crisp metallic clink
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(2400, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(1200, now + 0.2);

    oscGain.gain.setValueAtTime(0.25, now + 0.04);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now + 0.04);
    osc.stop(now + 0.2);
  } catch {
    // Graceful fallback
  }
}

/**
 * Clockwork ratchet winding sound + melodic music box chime
 */
export function playKeyWindRatchetSound(step: number = 1) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 3 quick mechanical click pulses (ratchet gear)
    for (let i = 0; i < 3; i++) {
      const clickTime = now + i * 0.04;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(800 + i * 150, clickTime);

      gain.gain.setValueAtTime(0.15, clickTime);
      gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(clickTime);
      osc.stop(clickTime + 0.025);
    }

    // Followed by a pure, bell-like music box note (stepping up with each wind: C6 -> E6 -> G6)
    const pitches = [1046.5, 1318.51, 1567.98]; // C6, E6, G6
    const noteFreq = pitches[Math.min(step - 1, pitches.length - 1)] || 1046.5;

    const chime = ctx.createOscillator();
    const chimeGain = ctx.createGain();
    chime.type = "sine";
    chime.frequency.setValueAtTime(noteFreq, now + 0.12);

    chimeGain.gain.setValueAtTime(0.2, now + 0.12);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    chime.connect(chimeGain);
    chimeGain.connect(ctx.destination);
    chime.start(now + 0.12);
    chime.stop(now + 0.5);
  } catch {
    // Graceful fallback
  }
}

/**
 * Tactile scratch-off card sound
 */
export function playScratchSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const bufferSize = Math.floor(ctx.sampleRate * 0.05);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(2000, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
  } catch {
    // Graceful fallback
  }
}

/**
 * Silky ribbon untie sound
 */
export function playRibbonUntieSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(500, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.25);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } catch {
    // Graceful fallback
  }
}

/**
 * Escalating combo sound for Love Rush button
 */
export function playComboSound(combo: number) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const baseFreq = 440;
    // Step up frequency based on combo level (up to 2 octaves)
    const freq = baseFreq * Math.pow(1.05, Math.min(combo, 35));

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = combo > 20 ? "triangle" : "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.09);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  } catch {
    // Graceful fallback
  }
}

interface Note {
  freq: number;
  dur: number;
  pause: number;
}

interface PlaylistTrack {
  id: number;
  name: string;
  notes: Note[];
}

const PLAYLIST: PlaylistTrack[] = [
  {
    id: 0,
    name: "Happy Birthday Music Box 🎂",
    notes: [
      { freq: 261.63, dur: 0.35, pause: 0.4 },
      { freq: 261.63, dur: 0.2, pause: 0.25 },
      { freq: 293.66, dur: 0.5, pause: 0.6 },
      { freq: 261.63, dur: 0.5, pause: 0.6 },
      { freq: 349.23, dur: 0.5, pause: 0.6 },
      { freq: 329.63, dur: 0.8, pause: 1.0 },

      { freq: 261.63, dur: 0.35, pause: 0.4 },
      { freq: 261.63, dur: 0.2, pause: 0.25 },
      { freq: 293.66, dur: 0.5, pause: 0.6 },
      { freq: 261.63, dur: 0.5, pause: 0.6 },
      { freq: 392.00, dur: 0.5, pause: 0.6 },
      { freq: 349.23, dur: 0.8, pause: 1.0 },

      { freq: 261.63, dur: 0.35, pause: 0.4 },
      { freq: 261.63, dur: 0.2, pause: 0.25 },
      { freq: 523.25, dur: 0.6, pause: 0.7 },
      { freq: 440.00, dur: 0.5, pause: 0.6 },
      { freq: 349.23, dur: 0.5, pause: 0.6 },
      { freq: 329.63, dur: 0.5, pause: 0.6 },
      { freq: 293.66, dur: 0.8, pause: 1.0 },

      { freq: 466.16, dur: 0.35, pause: 0.4 },
      { freq: 466.16, dur: 0.2, pause: 0.25 },
      { freq: 440.00, dur: 0.5, pause: 0.6 },
      { freq: 349.23, dur: 0.5, pause: 0.6 },
      { freq: 392.00, dur: 0.6, pause: 0.7 },
      { freq: 349.23, dur: 1.2, pause: 1.8 },
    ],
  },
];

/**
 * Romantic Music Box Synthesizer (Multi-track)
 */
class MusicBoxSynth {
  private isPlaying: boolean = false;
  private timerId: NodeJS.Timeout | null = null;
  private masterGain: GainNode | null = null;
  private currentTrackIdx: number = 0;
  private currentVolume: number = 0.25;

  start(volume: number = 0.25) {
    this.currentVolume = volume;
    if (this.isPlaying) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    this.isPlaying = true;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    this.masterGain.connect(ctx.destination);

    let noteIndex = 0;
    const playNextNote = () => {
      if (!this.isPlaying || !ctx || !this.masterGain) return;

      const track = PLAYLIST[this.currentTrackIdx];
      const melody = track.notes;
      const item = melody[noteIndex];
      const now = ctx.currentTime;

      // Bell / Celesta overtone harmonics
      const freqs = [item.freq, item.freq * 2, item.freq * 3];
      const weights = [0.6, 0.25, 0.15];

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(f, now);

        const initialGain = weights[idx] * 0.3;
        noteGain.gain.setValueAtTime(initialGain, now);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + item.dur * 1.6);

        osc.connect(noteGain);
        noteGain.connect(this.masterGain!);

        osc.start(now);
        osc.stop(now + item.dur * 1.6);
      });

      noteIndex = (noteIndex + 1) % melody.length;
      this.timerId = setTimeout(playNextNote, item.pause * 1000);
    };

    playNextNote();
  }

  stop() {
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.masterGain) {
      try {
        const ctx = getAudioContext();
        if (ctx) {
          this.masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        }
      } catch {
        // ignore
      }
      this.masterGain = null;
    }
  }

  switchNextTrack(): string {
    this.stop();
    this.currentTrackIdx = (this.currentTrackIdx + 1) % PLAYLIST.length;
    this.start(this.currentVolume);
    return PLAYLIST[this.currentTrackIdx].name;
  }

  getCurrentTrackName(): string {
    return PLAYLIST[this.currentTrackIdx].name;
  }

  getStatus() {
    return this.isPlaying;
  }
}

export const musicBoxSynth = new MusicBoxSynth();
