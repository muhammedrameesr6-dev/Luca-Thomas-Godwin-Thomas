/**
 * Main Application Script
 * Luca Thomas & Godwin Thomas – Baptism & Holy Communion
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader dismissal
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('loaded');
    }, 600);
  });
  // Fallback in case load takes longer
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
    }
  }, 2000);

  // 2. Header scroll styling & Active Link Tracking
  const header = document.querySelector('.site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY;

    // Header blur/shadow
    if (scrollPos > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // 3. Mobile Navigation Drawer
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. Scroll Reveal Animations (IntersectionObserver)
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-scale');
  if ('IntersectionObserver' in window) {
    document.body.classList.add('js-reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px 100px 0px',
      threshold: 0.05
    });

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // 5. Live Countdown Timer
  // Target: 19 December 2026, 5:00 PM IST (GMT+5:30)
  const eventDate = new Date('2026-12-19T17:00:00+05:30').getTime();

  const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = eventDate - now;

    const daysEl = document.getElementById('cdDays');
    const hoursEl = document.getElementById('cdHours');
    const minsEl = document.getElementById('cdMins');
    const secsEl = document.getElementById('cdSecs');

    if (!daysEl) return;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      const title = document.querySelector('.countdown-title');
      if (title) title.textContent = 'Today is the Blessed Celebration!';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = days.toString().padStart(2, '0');
    hoursEl.textContent = hours.toString().padStart(2, '0');
    minsEl.textContent = minutes.toString().padStart(2, '0');
    secsEl.textContent = seconds.toString().padStart(2, '0');
  };

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // 6. Add to Calendar Functionality
  // A) Google Calendar Link
  const gcalBtn = document.getElementById('btnGoogleCal');
  if (gcalBtn) {
    const title = encodeURIComponent('Baptism & Holy Communion – Luca Thomas & Godwin Thomas');
    const details = encodeURIComponent('Join Anil Thomas & Preema Lopes in celebrating the Baptism of Luca Thomas and the First Holy Communion of Godwin Thomas at St. Mathew\'s Church, Pozhiyoor followed by reception at Carmel Sports Club.');
    const location = encodeURIComponent('St. Mathew\'s Church, Pozhiyoor, Kerala');
    // 20261219T113000Z to 20261219T153000Z (5:00 PM IST is 11:30 AM UTC)
    const dates = '20261219T113000Z/20261219T153000Z';
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;

    gcalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.open(gcalUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // B) Downloadable iCal (.ics)
  const icalBtn = document.getElementById('btnIcal');
  if (icalBtn) {
    icalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const icsData = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Luca and Godwin Thomas//Baptism and Holy Communion//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:luca-godwin-communion-2026@celebration.faith',
        'DTSTAMP:20261122T000000Z',
        'DTSTART:20261219T113000Z',
        'DTEND:20261219T153000Z',
        'SUMMARY:Baptism & Holy Communion – Luca Thomas & Godwin Thomas',
        'DESCRIPTION:Celebration of Faith & Blessings for Luca Thomas (Baptism) and Godwin Thomas (Holy Communion). With love, Anil Thomas & Preema Lopes.',
        'LOCATION:St. Mathew\'s Church, Pozhiyoor, Kerala',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Luca_and_Godwin_Celebration.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Event calendar file downloaded!');
    });
  }

  // 7. Copy Address / Sharing
  const copyChurchBtn = document.getElementById('copyChurchAddress');
  if (copyChurchBtn) {
    copyChurchBtn.addEventListener('click', () => {
      const address = "St. Mathew's Church, South Kollencode, Pozhiyoor P.O., Thiruvananthapuram, Kerala 695506";
      navigator.clipboard.writeText(address).then(() => {
        showToast('Church address copied to clipboard!');
      }).catch(() => {
        showToast('Copied: St. Mathew\'s Church, Pozhiyoor');
      });
    });
  }

  const copyReceptionBtn = document.getElementById('copyReceptionAddress');
  if (copyReceptionBtn) {
    copyReceptionBtn.addEventListener('click', () => {
      const address = "Carmel Sports Club / Hub, Pozhiyoor, Kerala";
      navigator.clipboard.writeText(address).then(() => {
        showToast('Reception venue address copied to clipboard!');
      }).catch(() => {
        showToast('Copied: Carmel Sports Club, Pozhiyoor');
      });
    });
  }

  // 8. Blessings Guestbook (Saved to localStorage)
  const guestbookForm = document.getElementById('guestbookForm');
  const blessingsList = document.getElementById('blessingsList');

  const defaultBlessings = [
    {
      author: 'Rev. Fr. & Parish Community',
      date: 'Blessing',
      message: 'May God\'s grace and Holy Spirit forever guide young Luca in faith and light, and may the Holy Eucharist strengthen dear Godwin on every step of his spiritual journey.'
    },
    {
      author: 'Dearest Family Friends',
      date: 'With Love',
      message: 'Congratulations Anil and Preema on this joyful dual celebration! Luca and Godwin look absolutely precious. Showering abundant prayers, happiness, and peace upon your beautiful family.'
    }
  ];

  const loadBlessings = () => {
    let saved = [];
    try {
      const stored = localStorage.getItem('luca_godwin_blessings');
      saved = stored ? JSON.parse(stored) : defaultBlessings;
    } catch (e) {
      saved = defaultBlessings;
    }

    if (!blessingsList) return;
    blessingsList.innerHTML = '';

    saved.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'blessing-card';
      card.innerHTML = `
        <div class="blessing-card-header">
          <span class="blessing-author">${escapeHtml(item.author)}</span>
          <span class="blessing-date">${escapeHtml(item.date)}</span>
        </div>
        <p class="blessing-message">${escapeHtml(item.message)}</p>
      `;
      blessingsList.appendChild(card);
    });
  };

  if (guestbookForm) {
    guestbookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const authorInput = document.getElementById('blessingAuthor');
      const messageInput = document.getElementById('blessingText');

      const author = authorInput.value.trim();
      const message = messageInput.value.trim();

      if (!author || !message) return;

      const newEntry = {
        author: author,
        date: 'Just now',
        message: message
      };

      let existing = [];
      try {
        const stored = localStorage.getItem('luca_godwin_blessings');
        existing = stored ? JSON.parse(stored) : defaultBlessings;
      } catch (err) {
        existing = defaultBlessings;
      }

      existing.unshift(newEntry);
      try {
        localStorage.setItem('luca_godwin_blessings', JSON.stringify(existing));
      } catch (err) {}

      authorInput.value = '';
      messageInput.value = '';

      loadBlessings();
      showToast('Thank you! Your heartfelt blessing has been shared.');
    });

    loadBlessings();
  }

  // 9. Photo Showcase Carousel ("A Beautiful Moment")
  const trackContainer = document.getElementById('galleryTrackContainer');
  const track = document.getElementById('galleryTrack');
  const prevBtn = document.getElementById('galleryPrevBtn');
  const nextBtn = document.getElementById('galleryNextBtn');
  const dots = document.querySelectorAll('.carousel-dot');
  const slides = document.querySelectorAll('.carousel-slide');
  const currentSlideNum = document.getElementById('currentSlideNum');

  if (trackContainer && slides.length > 0) {
    // Scroll by one slide
    const scrollSlide = (direction) => {
      const slideWidth = slides[0].offsetWidth;
      const gap = 24;
      const scrollAmount = (slideWidth + gap) * direction;
      trackContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => scrollSlide(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => scrollSlide(1));
    }

    // Dot click navigation
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.getAttribute('data-index'), 10);
        if (slides[idx]) {
          const slideLeft = slides[idx].offsetLeft - trackContainer.offsetLeft;
          const target = slideLeft - (trackContainer.clientWidth - slides[idx].offsetWidth) / 2;
          trackContainer.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
        }
      });
    });

    // Update active slide, indicator dots, and counter on scroll
    let scrollTimeout;
    const updateActiveSlide = () => {
      const containerCenter = trackContainer.scrollLeft + trackContainer.clientWidth / 2;
      let closestIdx = 0;
      let minDiff = Infinity;

      slides.forEach((slide, idx) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const diff = Math.abs(containerCenter - slideCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === closestIdx);
      });

      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === closestIdx);
      });

      if (currentSlideNum) {
        currentSlideNum.textContent = closestIdx + 1;
      }
    };

    trackContainer.addEventListener('scroll', () => {
      if (scrollTimeout) cancelAnimationFrame(scrollTimeout);
      scrollTimeout = requestAnimationFrame(updateActiveSlide);
    }, { passive: true });

    updateActiveSlide();
  }

  // 10. Photo Gallery Lightbox
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  if (lightboxModal && slides.length > 0) {
    slides.forEach((slide) => {
      const card = slide.querySelector('.carousel-card');
      const expandBtn = slide.querySelector('.carousel-expand-btn');

      const openModal = (e) => {
        const img = slide.querySelector('.carousel-card-img');
        const caption = slide.getAttribute('data-caption') || slide.querySelector('.carousel-card-title')?.textContent || '';
        if (img && lightboxImg) {
          lightboxImg.src = img.src;
          lightboxImg.alt = img.alt || 'Enlarged photo';
          if (lightboxCaption) {
            lightboxCaption.innerHTML = caption;
          }
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      };

      if (card) {
        card.addEventListener('click', openModal);
      }
      if (expandBtn) {
        expandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          openModal(e);
        });
      }
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
      if (lightboxImg) lightboxImg.src = '';
    };

    if (lightboxCloseBtn) {
      lightboxCloseBtn.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // Helper: Toast Message
  function showToast(msg) {
    let toast = document.getElementById('toastNotice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toastNotice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
