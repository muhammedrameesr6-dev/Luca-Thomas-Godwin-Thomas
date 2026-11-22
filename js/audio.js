/**
 * Invisible Autoplay Background Audio Controller
 * Automatically plays music on page load or on first user interaction (touch/click/scroll)
 * without requiring any visible UI controls or logos.
 */

class InvisibleAudioAutoplay {
  constructor() {
    this.audioEl = document.getElementById('bgAudio');
    this.isPlaying = false;
    this.hasStarted = false;
    this.init();
  }

  init() {
    if (!this.audioEl) return;

    this.audioEl.loop = true;
    this.audioEl.volume = 0.6;

    // Loop fallback
    this.audioEl.addEventListener('ended', () => {
      this.audioEl.currentTime = 0;
      this.audioEl.play().catch(() => {});
    });

    // 1. Attempt autoplay immediately
    this.tryPlay();

    // 2. Browser autoplay policy fallback: start on first touch, click, scroll, or key
    const unlockEvents = ['click', 'touchstart', 'touchend', 'pointerdown', 'scroll', 'keydown'];
    const unlockHandler = () => {
      if (!this.hasStarted) {
        this.tryPlay();
      }
      unlockEvents.forEach((evt) => {
        window.removeEventListener(evt, unlockHandler, { capture: true });
        document.removeEventListener(evt, unlockHandler, { capture: true });
      });
    };

    unlockEvents.forEach((evt) => {
      window.addEventListener(evt, unlockHandler, { capture: true, once: true, passive: true });
      document.addEventListener(evt, unlockHandler, { capture: true, once: true, passive: true });
    });
  }

  tryPlay() {
    if (this.hasStarted && this.isPlaying) return;

    if (this.audioEl) {
      const promise = this.audioEl.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            this.isPlaying = true;
            this.hasStarted = true;
          })
          .catch(() => {
            // Browser blocked unprompted autoplay without user gesture;
            // The one-time interaction listeners above will trigger immediately on first touch.
          });
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.invisibleAudio = new InvisibleAudioAutoplay();
});
