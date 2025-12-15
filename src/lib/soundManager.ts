// Sound Manager using Web Audio API for programmatic sound generation
class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = false;
  private lastPlayTime: { [key: string]: number } = {};
  private minInterval = 100; // Minimum 100ms between same sound type (max 10/sec)

  constructor() {
    // Initialize AudioContext lazily to avoid autoplay issues
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    // Resume audio context if it was suspended (browser autoplay policy)
    if (enabled && this.audioContext?.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private shouldPlay(soundType: string): boolean {
    if (!this.enabled || !this.audioContext) return false;
    
    const now = Date.now();
    const lastTime = this.lastPlayTime[soundType] || 0;
    
    if (now - lastTime < this.minInterval) {
      return false; // Debounce: too soon since last play
    }
    
    this.lastPlayTime[soundType] = now;
    return true;
  }

  // Compare sound: Short beep at 600Hz, 250ms, volume 0.3
  playCompareSound() {
    if (!this.shouldPlay('compare')) return;

    try {
      const ctx = this.audioContext!;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.value = 600; // 600Hz beep
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.25);
    } catch (error) {
      console.warn('Failed to play compare sound:', error);
    }
  }

  // Swap sound: Woosh from 300Hz to 200Hz, 300ms, volume 0.4
  playSwapSound() {
    if (!this.shouldPlay('swap')) return;

    try {
      const ctx = this.audioContext!;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.frequency.setValueAtTime(300, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
      oscillator.type = 'triangle';

      gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.3);
    } catch (error) {
      console.warn('Failed to play swap sound:', error);
    }
  }

  // Sorted sound: Ascending chime (C-E-G notes), 600ms, volume 0.5
  playSortedSound() {
    if (!this.enabled || !this.audioContext) return;

    try {
      const ctx = this.audioContext!;
      const notes = [261.63, 329.63, 392.00]; // C4, E4, G4 frequencies
      const noteDuration = 0.2; // 200ms per note

      notes.forEach((frequency, index) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        const startTime = ctx.currentTime + (index * noteDuration);
        gainNode.gain.setValueAtTime(0.5, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + noteDuration);

        oscillator.start(startTime);
        oscillator.stop(startTime + noteDuration);
      });
    } catch (error) {
      console.warn('Failed to play sorted sound:', error);
    }
  }

  // Clean up resources
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
