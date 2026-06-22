/* ============================================================
   GreenPrint — Percetakan Profesional
   Main Script (script.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================
     1. DOM ELEMENT REFERENCES
     ========================================================== */
  const DOM = {
    navbar:        document.getElementById('navbar'),
    menuBtn:       document.getElementById('menuBtn'),
    closeMenuBtn:  document.getElementById('closeMenu'),
    mobileMenu:    document.getElementById('mobileMenu'),
    mobileLinks:   document.querySelectorAll('.mobile-link'),
    backToTop:     document.getElementById('backToTop'),
    contactForm:   document.getElementById('contactForm'),
    toast:         document.getElementById('toast'),
    toastMsg:      document.getElementById('toast-msg'),
    testiTrack:    document.getElementById('testimonialTrack'),
    prevTesti:     document.getElementById('prevTesti'),
    nextTesti:     document.getElementById('nextTesti'),
    testiDots:     document.querySelectorAll('.testi-dot'),
    filterBtns:    document.querySelectorAll('.filter-btn'),
    portfolioCards:document.querySelectorAll('#portfolioGrid .portfolio-card'),
    faqToggles:    document.querySelectorAll('.faq-toggle'),
    faqItems:      document.querySelectorAll('.faq-item'),
    counters:      document.querySelectorAll('.counter'),
    revealEls:     document.querySelectorAll('.reveal'),
    anchorLinks:   document.querySelectorAll('a[href^="#"]'),
  };

  /* ==========================================================
     2. UTILITY FUNCTIONS
     ========================================================== */

  /**
   * Debounce — mencegah fungsi dipanggil terlalu sering
   * @param {Function} fn - Fungsi yang akan di-debounce
   * @param {number} delay - Delay dalam ms
   * @returns {Function}
   */
  function debounce(fn, delay = 100) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Easing function cubic-bezier(0.33, 1, 0.68, 1) versi JS
   * @param {number} t - Progress 0–1
   * @returns {number}
   */
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  /**
   * Format angka ke format Indonesia
   * @param {number} n
   * @returns {string}
   */
  function formatNumber(n) {
    return n >= 1000 ? n.toLocaleString('id-ID') + '+' : n + '+';
  }

  /* ==========================================================
     3. TOAST NOTIFICATION SYSTEM
     ========================================================== */
  let toastTimer = null;

  /**
   * Tampilkan toast notification
   * @param {string} message - Pesan yang ditampilkan
   * @param {number} duration - Durasi tampil dalam ms (default 4000)
   * @param {string} type - Tipe: 'success' | 'error' | 'info'
   */
  function showToast(message, duration = 4000, type = 'success') {
    if (!DOM.toast || !DOM.toastMsg) return;

    // Clear timer sebelumnya jika ada
    if (toastTimer) clearTimeout(toastTimer);

    // Update icon berdasarkan tipe
    const iconEl = DOM.toast.querySelector('iconify-icon');
    const colorMap = {
      success: { icon: 'mdi:check-circle', color: '#34d399', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
      error:   { icon: 'mdi:alert-circle', color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.3)' },
      info:    { icon: 'mdi:information',   color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)' },
    };

    const config = colorMap[type] || colorMap.success;
    iconEl.setAttribute('icon', config.icon);
    iconEl.style.color = config.color;
    DOM.toast.style.background = config.bg;
    DOM.toast.style.borderColor = config.border;
    DOM.toastMsg.textContent = message;

    // Tampilkan
    DOM.toast.classList.add('show');

    // Sembunyikan setelah durasi
    toastTimer = setTimeout(() => {
      DOM.toast.classList.remove('show');
    }, duration);
  }

  /* ==========================================================
     4. MOBILE MENU
     ========================================================== */
  function initMobileMenu() {
    if (!DOM.menuBtn || !DOM.mobileMenu) return;

    DOM.menuBtn.addEventListener('click', () => {
      DOM.mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden'; // Lock scroll
    });

    const closeMenu = () => {
      DOM.mobileMenu.classList.remove('open');
      document.body.style.overflow = ''; // Unlock scroll
    };

    if (DOM.closeMenuBtn) DOM.closeMenuBtn.addEventListener('click', closeMenu);
    DOM.mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    // Tutup dengan ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.mobileMenu.classList.contains('open')) {
        closeMenu();
      }
    });

    // Tutup saat klik overlay (area di luar menu)
    DOM.mobileMenu.addEventListener('click', (e) => {
      if (e.target === DOM.mobileMenu) closeMenu();
    });
  }

  /* ==========================================================
     5. NAVBAR SCROLL BEHAVIOR
     ========================================================== */
  function initNavbarScroll() {
    if (!DOM.navbar) return;

    const handleScroll = () => {
      if (window.scrollY > 50) {
        DOM.navbar.classList.add('scrolled');
      } else {
        DOM.navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on init
  }

  /* ==========================================================
     6. BACK TO TOP BUTTON
     ========================================================== */
  function initBackToTop() {
    if (!DOM.backToTop) return;

    const handleScroll = () => {
      if (window.scrollY > 600) {
        DOM.backToTop.classList.add('visible');
      } else {
        DOM.backToTop.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    DOM.backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================
     7. SMOOTH SCROLL FOR ANCHOR LINKS
     ========================================================== */
  function initSmoothScroll() {
    DOM.anchorLinks.forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const navHeight = DOM.navbar ? DOM.navbar.offsetHeight : 0;
          const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 16;

          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /* ==========================================================
     8. SCROLL REVEAL (IntersectionObserver)
     ========================================================== */
  function initScrollReveal() {
    if (!DOM.revealEls.length) return;

    // Cek apakah user memilih reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      DOM.revealEls.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop observing setelah terlihat (one-time)
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    DOM.revealEls.forEach(el => observer.observe(el));
  }

  /* ==========================================================
     9. COUNTER ANIMATION
     ========================================================== */
  function initCounters() {
    if (!DOM.counters.length) return;

    let started = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !started) {
            started = true;
            animateAllCounters();
            observer.disconnect(); // Stop observing
          }
        });
      },
      { threshold: 0.5 }
    );

    DOM.counters.forEach(c => observer.observe(c));

    function animateAllCounters() {
      DOM.counters.forEach(counter => {
        const target = parseInt(counter.dataset.target, 10);
        if (isNaN(target)) return;

        const duration = 2000;
        const startTime = performance.now();

        function step(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easedProgress = easeOutCubic(progress);
          const currentValue = Math.floor(easedProgress * target);

          counter.textContent = formatNumber(currentValue);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            counter.textContent = formatNumber(target);
          }
        }

        requestAnimationFrame(step);
      });
    }
  }

  /* ==========================================================
     10. PORTFOLIO FILTER
     ========================================================== */
  function initPortfolioFilter() {
    if (!DOM.filterBtns.length || !DOM.portfolioCards.length) return;

    // Set state awal
    setActiveFilter(DOM.filterBtns[0]);

    DOM.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active state
        setActiveFilter(btn);

        // Filter cards
        DOM.portfolioCards.forEach((card, index) => {
          const shouldShow = filter === 'all' || card.dataset.cat === filter;

          if (shouldShow) {
            card.style.display = '';
            // Trigger reflow untuk animasi
            void card.offsetHeight;
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.97)';

            // Stagger delay
            setTimeout(() => {
              card.style.transition = 'all 0.4s cubic-bezier(0.33, 1, 0.68, 1)';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, index * 60);
          } else {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.97)';

            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });

    function setActiveFilter(activeBtn) {
      DOM.filterBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.borderColor = 'rgba(255,255,255,0.1)';
        b.style.color = '#a3a3a3';
      });
      activeBtn.classList.add('active');
      activeBtn.style.background = 'rgba(16,185,129,0.1)';
      activeBtn.style.borderColor = 'rgba(16,185,129,0.3)';
      activeBtn.style.color = '#34d399';
    }
  }

  /* ==========================================================
     11. TESTIMONIAL SLIDER
     ========================================================== */
  function initTestimonialSlider() {
    if (!DOM.testiTrack || !DOM.testiDots.length) return;

    const totalSlides = DOM.testiDots.length;
    let currentSlide = 0;
    let autoPlayTimer = null;
    let isHovering = false;

    function goToSlide(index) {
      currentSlide = ((index % totalSlides) + totalSlides) % totalSlides; // Wrap around
      DOM.testiTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      // Update dots
      DOM.testiDots.forEach((dot, i) => {
        if (i === currentSlide) {
          dot.style.width = '24px';
          dot.style.background = '#34d399';
        } else {
          dot.style.width = '10px';
          dot.style.background = 'rgba(255,255,255,0.2)';
        }
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        if (!isHovering) nextSlide();
      }, 6000);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
    }

    // Event listeners — buttons
    if (DOM.prevTesti) DOM.prevTesti.addEventListener('click', () => { prevSlide(); startAutoPlay(); });
    if (DOM.nextTesti) DOM.nextTesti.addEventListener('click', () => { nextSlide(); startAutoPlay(); });

    // Event listeners — dots
    DOM.testiDots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.slide, 10));
        startAutoPlay();
      });
    });

    // Pause on hover
    const sliderContainer = DOM.testiTrack.parentElement;
    sliderContainer.addEventListener('mouseenter', () => { isHovering = true; });
    sliderContainer.addEventListener('mouseleave', () => { isHovering = false; });

    // Touch / Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      isHovering = true; // Pause autoplay during swipe
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide(); // Swipe left → next
        } else {
          prevSlide(); // Swipe right → prev
        }
      }
      isHovering = false;
    }, { passive: true });

    // Keyboard navigation
    sliderContainer.setAttribute('tabindex', '0');
    sliderContainer.setAttribute('role', 'region');
    sliderContainer.setAttribute('aria-label', 'Testimonial slider');
    sliderContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { prevSlide(); startAutoPlay(); }
      if (e.key === 'ArrowRight') { nextSlide(); startAutoPlay(); }
    });

    // Init
    goToSlide(0);
    startAutoPlay();
  }

  /* ==========================================================
     12. FAQ ACCORDION
     ========================================================== */
  function initFaqAccordion() {
    if (!DOM.faqToggles.length) return;

    DOM.faqToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const currentItem = toggle.parentElement;
        const isOpen = currentItem.classList.contains('open');

        // Tutup semua item terlebih dahulu
        DOM.faqItems.forEach(item => {
          item.classList.remove('open');
        });

        // Buka item yang diklik (jika sebelumnya tertutup)
        if (!isOpen) {
          currentItem.classList.add('open');
        }
      });
    });

    // Keyboard: Enter/Space untuk toggle
    DOM.faqToggles.forEach(toggle => {
      toggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle.click();
        }
      });
    });
  }

  /* ==========================================================
     13. CONTACT FORM VALIDATION & SUBMISSION
     ========================================================== */
  function initContactForm() {
    if (!DOM.contactForm) return;

    DOM.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formData = new FormData(DOM.contactForm);
      const name    = (formData.get('name') || '').trim();
      const phone   = (formData.get('phone') || '').trim();
      const email   = (formData.get('email') || '').trim();
      const service = formData.get('service');
      const message = (formData.get('message') || '').trim();

      // Validasi field wajib
      if (!name) {
        showToast('Mohon isi nama lengkap Anda', 3500, 'error');
        DOM.contactForm.querySelector('[name="name"]').focus();
        return;
      }

      if (!phone) {
        showToast('Mohon isi nomor WhatsApp Anda', 3500, 'error');
        DOM.contactForm.querySelector('[name="phone"]').focus();
        return;
      }

      // Validasi format telepon (minimal 10 digit angka)
      const phoneClean = phone.replace(/[\s\-+()]/g, '');
      if (!/^\d{10,15}$/.test(phoneClean)) {
        showToast('Format nomor telepon tidak valid', 3500, 'error');
        DOM.contactForm.querySelector('[name="phone"]').focus();
        return;
      }

      if (!service) {
        showToast('Mohon pilih jenis layanan', 3500, 'error');
        DOM.contactForm.querySelector('[name="service"]').focus();
        return;
      }

      if (!message) {
        showToast('Mohon jelaskan detail pesanan Anda', 3500, 'error');
        DOM.contactForm.querySelector('[name="message"]').focus();
        return;
      }

      // Validasi email opsional (jika diisi, harus valid)
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Format email tidak valid', 3500, 'error');
        DOM.contactForm.querySelector('[name="email"]').focus();
        return;
      }

      // Simulasi pengiriman (loading state)
      const submitBtn = DOM.contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Mengirim...
      `;

      // Simulasi delay server
      setTimeout(() => {
        showToast(`Terima kasih ${name}! Pesanan Anda akan segera kami proses melalui WhatsApp.`, 5000, 'success');
        DOM.contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }, 1500);
    });

    // Real-time validation feedback
    const inputs = DOM.contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        if (input.required && !input.value.trim()) {
          input.style.borderColor = 'rgba(248,113,113,0.5)';
        } else if (input.value.trim()) {
          input.style.borderColor = 'rgba(16,185,129,0.4)';
        } else {
          input.style.borderColor = 'rgba(255,255,255,0.1)';
        }
      });

      input.addEventListener('focus', () => {
        input.style.borderColor = 'rgba(16,185,129,0.4)';
      });

      // Clear error state on input
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.style.borderColor = 'rgba(16,185,129,0.4)';
        }
      });
    });
  }

  /* ==========================================================
     14. ACTIVE NAV LINK ON SCROLL (Spy)
     ========================================================== */
  function initNavSpy() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length || !DOM.navbar) return;

    const navLinks = DOM.navbar.querySelectorAll('.nav-link');

    const handleScroll = debounce(() => {
      const scrollPos = window.scrollY + DOM.navbar.offsetHeight + 100;

      sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if (scrollPos >= top && scrollPos < top + height) {
          navLinks.forEach(link => {
            link.classList.remove('text-emerald-400');
            link.classList.add('text-slate-300');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('text-emerald-400');
              link.classList.remove('text-slate-300');
            }
          });
        }
      });
    }, 50);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ==========================================================
     15. TYPING EFFECT (Optional — untuk hero subtitle)
     ========================================================== */
  function initTypingEffect() {
    const typingEl = document.getElementById('typingText');
    if (!typingEl) return;

    const words = ['Profesional', 'Berkualitas', 'Terpercaya', 'Cepat'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseDuration = 2000;

    function type() {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        charIndex--;
        typingEl.textContent = currentWord.substring(0, charIndex);
      } else {
        charIndex++;
        typingEl.textContent = currentWord.substring(0, charIndex);
      }

      let delay = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        delay = pauseDuration;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        delay = 300;
      }

      setTimeout(type, delay);
    }

    // Cek reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      type();
    } else {
      typingEl.textContent = words[0];
    }
  }

  /* ==========================================================
     16. LAZY LOAD IMAGES
     ========================================================== */
  function initLazyLoad() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    // Jika browser support native lazy loading, skip custom
    if ('loading' in HTMLImageElement.prototype) {
      images.forEach(img => {
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            // Fade in
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.4s ease';
            requestAnimationFrame(() => { img.style.opacity = '1'; });
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    images.forEach(img => observer.observe(img));
  }

  /* ==========================================================
     17. PARALLAX EFFECT (Subtle)
     ========================================================== */
  function initParallax() {
    const parallaxEls = document.querySelectorAll('[data-parallax]');
    if (!parallaxEls.length) return;

    // Skip jika reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      parallaxEls.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || 0.1;
        const rect = el.getBoundingClientRect();
        const offset = (rect.top + scrollY) * speed;
        el.style.transform = `translateY(${scrollY * speed - offset}px)`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  /* ==========================================================
     18. PRELOADER
     ========================================================== */
  function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          preloader.style.display = 'none';
          document.body.style.overflow = '';
        }, 500);
      }, 800);
    });

    // Fallback: sembunyikan preloader setelah 4 detik
    setTimeout(() => {
      if (preloader.style.display !== 'none') {
        preloader.style.opacity = '0';
        preloader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
          preloader.style.display = 'none';
          document.body.style.overflow = '';
        }, 500);
      }
    }, 4000);
  }

  /* ==========================================================
     19. KEYBOARD ACCESSIBILITY ENHANCEMENTS
     ========================================================== */
  function initAccessibility() {
    // Tambahkan focus-visible styles
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });

    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-emerald-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium';
    skipLink.textContent = 'Langsung ke konten utama';
    document.body.prepend(skipLink);

    // Tambahkan id main-content ke section pertama setelah navbar
    const firstSection = document.querySelector('section');
    if (firstSection && !document.getElementById('main-content')) {
      firstSection.id = 'main-content';
      firstSection.setAttribute('tabindex', '-1');
    }
  }

  /* ==========================================================
     20. CONSOLE BRANDING
     ========================================================== */
  function initConsoleBranding() {
    const styles = [
      'color: #10b981',
      'font-size: 14px',
      'font-weight: bold',
      'font-family: monospace',
    ].join(';');

    const subStyles = [
      'color: #94a3b8',
      'font-size: 11px',
      'font-family: monospace',
    ].join(';');

    console.log('%c🖨️ GreenPrint', styles);
    console.log('%cPercetakan Profesional — greenprint.co.id', subStyles);
  }

  /* ==========================================================
     21. PERFORMANCE: THROTTLE SCROLL EVENTS
     ========================================================== */
  // Menggabungkan semua scroll handler menjadi satu
  // agar tidak ada multiple scroll listeners
  function initOptimizedScroll() {
    const scrollCallbacks = [];

    function addScrollCallback(fn) {
      scrollCallbacks.push(fn);
    }

    function onScroll() {
      const scrollY = window.scrollY;
      scrollCallbacks.forEach(fn => fn(scrollY));
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Expose untuk modul lain
    return { addScrollCallback };
  }

  /* ==========================================================
     INIT — Jalankan Semua Modul
     ========================================================== */
  function init() {
    // Core
    initPreloader();
    initMobileMenu();
    initNavbarScroll();
    initBackToTop();
    initSmoothScroll();
    initAccessibility();

    // Animations
    initScrollReveal();
    initCounters();
    initTypingEffect();

    // Interactive Components
    initPortfolioFilter();
    initTestimonialSlider();
    initFaqAccordion();
    initContactForm();

    // Navigation
    initNavSpy();

    // Performance & Extras
    initLazyLoad();
    initParallax();
    initConsoleBranding();

    // Log init complete
    console.log('[GreenPrint] ✅ All modules initialized');
  }

  // Run
  init();
});