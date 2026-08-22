import type { Narration } from './types';

export interface NarrationPlayer {
  play(n: Narration): void;
  pause(): void;
  resume(): void;
  stop(): void;
  onSentence(cb: (index: number) => void): () => void;
  onEnded(cb: () => void): () => void;
}

export function sentenceIndexAt(n: Narration, timeSec: number): number {
  if (!n.cues || n.cues.length === 0) return 0;
  let index = 0;
  for (let i = 0; i < n.cues.length; i++) {
    if (n.cues[i] <= timeSec) {
      index = i;
    } else {
      break;
    }
  }
  return index;
}

export function unlockAudio(el: HTMLAudioElement): void {
  // Silent MP3 buffer to unlock browser audio autoplay restrictions
  el.src =
    'data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQxAADB8AhSmxhIIEVCSiJrDCQAAA=='
  el.play().catch(() => {});
}

export class AudioNarrationPlayer implements NarrationPlayer {
  private audio: HTMLAudioElement;
  private currentNarration: Narration | null = null;
  private currentSentenceIndex: number = -1;
  private sentenceListeners: Set<(index: number) => void> = new Set();
  private endedListeners: Set<() => void> = new Set();

  constructor(audioElement?: HTMLAudioElement) {
    if (audioElement) {
      this.audio = audioElement;
    } else if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      this.audio = new Audio();
    } else {
      this.audio = {} as HTMLAudioElement;
    }
    this.attachEventListeners();
  }

  private attachEventListeners(): void {
    if (!this.audio || !this.audio.addEventListener) return;

    this.audio.addEventListener('timeupdate', () => {
      if (!this.currentNarration) return;
      const index = sentenceIndexAt(this.currentNarration, this.audio.currentTime);
      if (index !== this.currentSentenceIndex) {
        this.currentSentenceIndex = index;
        this.sentenceListeners.forEach((cb) => cb(index));
      }
    });

    this.audio.addEventListener('ended', () => {
      this.endedListeners.forEach((cb) => cb());
    });
  }

  public play(n: Narration): void {
    this.currentNarration = n;
    this.currentSentenceIndex = -1;
    this.audio.src = n.audioUrl;
    if (this.audio.currentTime !== undefined) {
      this.audio.currentTime = 0;
    }
    if (this.audio.play) {
      this.audio.play().catch(() => {});
    }
  }

  public pause(): void {
    if (this.audio.pause) {
      this.audio.pause();
    }
  }

  public resume(): void {
    if (this.audio.play) {
      this.audio.play().catch(() => {});
    }
  }

  public stop(): void {
    if (this.audio.pause) {
      this.audio.pause();
    }
    if (this.audio.currentTime !== undefined) {
      this.audio.currentTime = 0;
    }
    this.currentSentenceIndex = -1;
  }

  public onSentence(cb: (index: number) => void): () => void {
    this.sentenceListeners.add(cb);
    if (this.currentSentenceIndex >= 0) {
      cb(this.currentSentenceIndex);
    }
    return () => {
      this.sentenceListeners.delete(cb);
    };
  }

  public onEnded(cb: () => void): () => void {
    this.endedListeners.add(cb);
    return () => {
      this.endedListeners.delete(cb);
    };
  }
}

export function createNarrationPlayer(audioElement?: HTMLAudioElement): NarrationPlayer {
  return new AudioNarrationPlayer(audioElement);
}
