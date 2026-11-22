/**
 * Photo Gallery Lightbox Manager
 * Smooth modal transitions, keyboard support, and caption display.
 */

class GalleryLightbox {
  constructor() {
    this.modal = document.getElementById('lightboxModal');
    this.modalImg = document.getElementById('lightboxImg');
    this.modalCaption = document.getElementById('lightboxCaption');
    this.closeBtn = document.getElementById('lightboxClose');
    this.galleryItems = document.querySelectorAll('.gallery-item');
    this.currentIndex = 0;
    this.itemsData = [];

    this.init();
  }

  init() {
    if (!this.modal || !this.galleryItems.length) return;

    // Collect gallery items
    this.galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      const title = item.querySelector('.gallery-overlay-title');
      const sub = item.querySelector('.gallery-overlay-sub');

      if (img) {
        this.itemsData.push({
          src: img.getAttribute('src'),
          caption: title ? title.textContent : (sub ? sub.textContent : 'Cherished Moment'),
          index: index
        });

        item.addEventListener('click', () => {
          this.open(index);
        });
      }
    });

    // Close on click close button
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();
      });
    }

    // Close on clicking backdrop
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal || e.target.classList.contains('lightbox-content')) {
        this.close();
      }
    });

    // Keyboard support: ESC to close, Left/Right for navigation
    document.addEventListener('keydown', (e) => {
      if (!this.modal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        this.close();
      } else if (e.key === 'ArrowRight') {
        this.next();
      } else if (e.key === 'ArrowLeft') {
        this.prev();
      }
    });
  }

  open(index) {
    if (index < 0 || index >= this.itemsData.length) return;
    this.currentIndex = index;
    const item = this.itemsData[index];

    this.modalImg.src = item.src;
    this.modalCaption.textContent = item.caption;

    this.modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  next() {
    const nextIdx = (this.currentIndex + 1) % this.itemsData.length;
    this.open(nextIdx);
  }

  prev() {
    const prevIdx = (this.currentIndex - 1 + this.itemsData.length) % this.itemsData.length;
    this.open(prevIdx);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.galleryLightbox = new GalleryLightbox();
});
