/**
 * CareMedBill - Master Synthesis Script (Vertex, Bass Construction & Azul Bio)
 * Working Light & Dark Executive Theme Engine with Split-Logo Entrance Trigger
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Working Light / Dark Executive Theme Engine
  const themeToggleBtn = document.getElementById('themeToggle') || document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('caremed_theme') || 'light';
  
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('caremed_theme', theme);
    
    const logoImgs = document.querySelectorAll('.logo-img, .split-logo-img');
    logoImgs.forEach(img => {
      if (theme === 'dark') {
        img.src = 'assets/img/logo-dark.png';
      } else {
        img.src = 'assets/img/logo.png';
      }
    });

    if (themeToggleBtn) {
      if (theme === 'dark') {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun" style="color: #f59e0b;"></i>';
        themeToggleBtn.setAttribute('title', 'Switch to Light Executive Mode');
      } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon" style="color: #0284c7;"></i>';
        themeToggleBtn.setAttribute('title', 'Switch to Dark Executive Mode');
      }
    }
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // 2. Mobile Navigation Drawer & Click Handler
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    // .navbar has a backdrop-filter, which makes it the containing block for any
    // position:fixed descendant — so the fixed full-screen menu panel would only
    // cover the navbar's own small box instead of the viewport. Reparenting to
    // <body> while open escapes that, then restores DOM order on close so the
    // desktop inline layout (nav sits between logo and nav-actions) is unaffected.
    const navLinksAnchor = document.createComment('nav-links-anchor');
    navLinks.after(navLinksAnchor);

    function openMenu() {
      document.body.appendChild(navLinks);
      navLinks.classList.add('active');
      document.body.classList.add('nav-open');
    }
    function closeMenu() {
      navLinks.classList.remove('active');
      document.body.classList.remove('nav-open');
      navLinksAnchor.after(navLinks);
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('active')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        closeMenu();
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMenu());
    });

    // Escape and desktop-resize safety net: if the viewport crosses into the
    // desktop breakpoint while the drawer is open, close it so navLinks gets
    // restored to its normal in-flow position in the navbar.
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) closeMenu();
    });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
      if (e.matches && navLinks.classList.contains('active')) closeMenu();
    });
  }

  // 3. BASS CONSTRUCTION HEADER SCROLL HIDE/SHOW ANIMATION
  const navbar = document.querySelector('.navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    
    if (navbar) {
      if (scrollTop > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      if (scrollTop > lastScrollTop && scrollTop > 160) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }
    }
    lastScrollTop = scrollTop;
  }, { passive: true });

  // 4. HERO BACKGROUND PARALLAX & BASS MORPHING EMBRYO FLUID CONTAINER
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  if (bgSlides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      bgSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % bgSlides.length;
      bgSlides[currentSlide].classList.add('active');
    }, 4500);
  }

  // Blob Frame Slide Cycler
  const blobSlides = document.querySelectorAll('.vrtx-blob-slide');
  if (blobSlides.length > 1) {
    let currentBlob = 0;
    setInterval(() => {
      blobSlides[currentBlob].classList.remove('active');
      currentBlob = (currentBlob + 1) % blobSlides.length;
      blobSlides[currentBlob].classList.add('active');
    }, 4000);
  }

  const gradientWords = document.querySelectorAll('.gradient-text, .subtitle');
  gradientWords.forEach(word => {
    word.addEventListener('mousemove', (e) => {
      const rect = word.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      word.style.backgroundPosition = `${x}% ${y}%`;
    });
    
    word.addEventListener('mouseleave', () => {
      word.style.backgroundPosition = '';
    });
  });

  const blobFrame = document.querySelector('.vrtx-blob-frame');
  const heroSlider = document.querySelector('.hero-bg-image-slider');
  const heroBox = document.querySelector('.hero-full-bg-container');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll-driven motion. The old loop rewrote transforms on every full-screen
  // hero photo (each carrying a 1.4s CSS transition, so every write restarted an
  // animation), reshaped the blob and repainted every gradient headline on every
  // frame — even off-screen — which made Firefox stutter badly. Now:
  //  * the parallax is ONE transform-only write on the slider container,
  //  * only elements actually near the viewport are touched,
  //  * updates run once per frame, and only while scrolling.
  // Image parallax was removed on purpose: repainting large clipped photos on
  // every scroll step is what made software-rendered Firefox stutter, and the
  // drift was at most ~15px. The photos keep their static 6% overscan crop.
  if (!reduceMotion) {
    const visible = new Set();
    const wordIndex = new Map();
    gradientWords.forEach((w, i) => wordIndex.set(w, i));

    const setWord = (word, y) => {
      const pos = Math.round((((y * 0.18) + (wordIndex.get(word) * 20)) % 300) * 2) / 2;
      if (word._bgPos !== pos) {
        word._bgPos = pos;
        word.style.backgroundPosition = `${pos}% 50%`;
      }
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          visible.add(e.target);
          if (wordIndex.has(e.target)) setWord(e.target, window.scrollY);
        } else {
          visible.delete(e.target);
        }
      });
    }, { rootMargin: '120px 0px' });
    gradientWords.forEach((w) => io.observe(w));
    if (blobFrame) io.observe(blobFrame);

    let heroHeight = heroBox ? heroBox.offsetHeight : 0;
    window.addEventListener('resize', () => { heroHeight = heroBox ? heroBox.offsetHeight : 0; }, { passive: true });
    if (heroSlider) heroSlider.style.willChange = 'transform';

    let lastScrollY = -1;
    let ticking = false;

    function updateScrollMotion() {
      ticking = false;
      const scrollY = window.scrollY;
      if (scrollY === lastScrollY) return;
      lastScrollY = scrollY;

      if (heroSlider && scrollY <= heroHeight + 50) {
        heroSlider.style.transform = `translate3d(0, ${(scrollY * 0.42).toFixed(1)}px, 0)`;
      }

      if (blobFrame && visible.has(blobFrame)) {
        const r1 = 60 + Math.sin(scrollY * 0.005) * 20;
        const r2 = 40 + Math.cos(scrollY * 0.006) * 20;
        const r3 = 70 + Math.sin(scrollY * 0.004) * 15;
        const r4 = 30 + Math.cos(scrollY * 0.007) * 25;
        blobFrame.style.borderRadius = `${r1}% ${100 - r1}% ${r3}% ${100 - r3}% / ${r2}% ${r4}% ${100 - r4}% ${100 - r2}%`;
      }

      visible.forEach((el) => { if (wordIndex.has(el)) setWord(el, scrollY); });
    }

    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(updateScrollMotion); }
    }, { passive: true });
    requestAnimationFrame(updateScrollMotion);
  }

  // 5. REPEATABLE 3D SPLIT-LOGO MERGE SCROLL ANIMATION
  const splitLogoWrapper = document.querySelector('.split-logo-wrapper');
  if (splitLogoWrapper) {
    const logoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          splitLogoWrapper.classList.add('is-merged');
        } else {
          // Reset logo halves so animation repeats every time user scrolls into view
          splitLogoWrapper.classList.remove('is-merged');
        }
      });
    }, { threshold: 0.15 });
    logoObserver.observe(splitLogoWrapper);
  }

  // 6. STAGGERED FEATURE CARD ENTRANCE & DUAL-SIDE FAST IMAGE REVEALS
  document.body.classList.add('js-reveal-init');
  
  const observerOptions = { threshold: 0.08, rootMargin: '0px 0px -30px 0px' };
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.classList.add('active');

        const imgReveal = entry.target.querySelector('.bass-img-reveal');
        if (imgReveal) imgReveal.classList.add('is-visible');
      }
    });
  }, observerOptions);

  // .flip-card is the outer bezel and is what the reveal layer fades in, so it
  // has to be observed here or the whole card would never become visible.
  const revealTargets = document.querySelectorAll('.title-reveal, .reveal-on-scroll, .reveal, .flip-card, .card, .bento-card, .service-card, .bass-img-card, .bass-reveal-left, .bass-reveal-right');
  revealTargets.forEach((el) => {
    // A flip face inside an already-observed bezel would double up the stagger.
    if (el.closest('.flip-card') && el !== el.closest('.flip-card')) return;
    const siblingIndex = Array.from(el.parentNode.children).indexOf(el);
    el.style.transitionDelay = `${(siblingIndex % 4) * 0.12}s`;
    revealObserver.observe(el);
  });

  // Failsafe: the reveal layer genuinely hides content until observed, so if
  // IntersectionObserver misfires for any reason the copy must not stay dark.
  // Anything still unrevealed after 4s gets shown unconditionally.
  window.setTimeout(() => {
    revealTargets.forEach((el) => {
      if (!el.classList.contains('is-visible')) {
        el.style.transitionDelay = '0s';
        el.classList.add('is-visible', 'active');
      }
    });
  }, 4000);

  // 7. Stat Counter Count-up Observer
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseFloat(entry.target.getAttribute('data-target'));
        const prefix = entry.target.getAttribute('data-prefix') || '';
        const suffix = entry.target.getAttribute('data-suffix') || '';
        let current = 0;
        const duration = 1800;
        const stepTime = 30;
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          entry.target.textContent = prefix + (Number.isInteger(target) ? Math.floor(current) : current.toFixed(1)) + suffix;
        }, stepTime);

        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(el => countObserver.observe(el));

  // 8. Practice ROI Revenue Calculator Engine
  const monthlyVolInput = document.getElementById('calcMonthlyVol');
  const denialRateInput = document.getElementById('calcDenialRate');
  const specialtyInput = document.getElementById('calcSpecialty');

  const volValDisplay = document.getElementById('calcVolVal');
  const denialValDisplay = document.getElementById('calcDenialVal');

  const annualGainDisplay = document.getElementById('calcAnnualGain');
  const cleanRateDisplay = document.getElementById('calcCleanRate');
  const hoursSavedDisplay = document.getElementById('calcHoursSaved');

  function calculatePracticeROI() {
    if (!monthlyVolInput || !denialRateInput) return;

    const monthlyVol = parseInt(monthlyVolInput.value, 10);
    const denialRate = parseFloat(denialRateInput.value);
    
    if (volValDisplay) volValDisplay.textContent = '$' + monthlyVol.toLocaleString();
    if (denialValDisplay) denialValDisplay.textContent = denialRate.toFixed(1) + '%';

    const currentLostRevenue = (monthlyVol * 12) * (denialRate / 100);
    const recoveredRevenue = currentLostRevenue * 0.88;
    const adminHoursSaved = Math.round((monthlyVol / 10000) * 14);

    if (annualGainDisplay) {
      annualGainDisplay.textContent = '+$' + Math.round(recoveredRevenue).toLocaleString() + '/yr';
    }
    if (cleanRateDisplay) {
      cleanRateDisplay.textContent = '99.4%';
    }
    if (hoursSavedDisplay) {
      hoursSavedDisplay.textContent = adminHoursSaved + ' hrs/mo';
    }
  }

  if (monthlyVolInput) monthlyVolInput.addEventListener('input', calculatePracticeROI);
  if (denialRateInput) denialRateInput.addEventListener('input', calculatePracticeROI);
  if (specialtyInput) specialtyInput.addEventListener('change', calculatePracticeROI);
  calculatePracticeROI();

  // 9. Command Center Financial Dashboard Tab Engine
  const dashTabs = document.querySelectorAll('.dash-tab-btn');
  const dashPanes = document.querySelectorAll('.dash-pane');

  dashTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetPaneId = tab.getAttribute('data-pane');
      dashTabs.forEach(t => t.classList.remove('active'));
      dashPanes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const activePane = document.getElementById(targetPaneId);
      if (activePane) activePane.classList.add('active');
    });
  });

  // 10. Interactive Specialty Search Filter
  const searchInput = document.getElementById('searchFilterInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const items = document.querySelectorAll('.searchable-item');

      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 11. FAQ Accordion Handler
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // 12. Modal Consultation & Form Submission Handler
  const modal = document.getElementById('contactModal');
  const openModalBtns = document.querySelectorAll('.open-modal');
  const closeModalBtn = document.getElementById('closeModal');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (modal) modal.classList.add('active');
    });
  });

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // Form submissions are handled by wireForm() at the bottom of this file, which
  // really sends them. (A global handler here used to cancel every submit and show a
  // fake "request received" popup, so no lead was ever delivered.)

  // 3D Flip Card Touch & Click Event Listener
  const flipCards = document.querySelectorAll('.flip-card');
  flipCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a') && !e.target.closest('button')) {
        card.classList.toggle('is-flipped');
      }
    });
  });

  // 13. EXECUTIVE CINEMATIC PAGE OPENING CURTAIN & HERO INTRO ENGINE
  const executiveCurtain = document.getElementById('executiveCurtain');
  const heroIntroSection = document.querySelector('.premium-hero-intro');

  if (heroIntroSection) {
    setTimeout(() => {
      heroIntroSection.classList.add('is-loaded');
    }, 150);
  }

  if (executiveCurtain) {
    setTimeout(() => {
      executiveCurtain.classList.add('is-opening');
    }, 650);

    setTimeout(() => {
      executiveCurtain.style.display = 'none';
    }, 2000);
  }

  // 14. CLIENT TESTIMONIALS ROTATING CAROUSEL
  // Avatars are initials-only by design: these are real named physicians,
  // and pairing a fabricated photo with a real person's testimonial invents
  // a likeness for someone who never sat for it.
  const testimonialsData = [
    {
      name: 'Dr. Syed Hussain',
      role: 'Nephrologist',
      initials: 'SH',
      color: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      text: "Care Med Billing has been a dependable partner for our practice. Their team understands the complexity of specialty billing and consistently follows through on claims, denials, and collections. Their support with billing workflows, RPM, and CCM has helped us stay organized while allowing our staff to focus more on patient care."
    },
    {
      name: 'Dr. Samira Khan',
      role: 'Internist',
      initials: 'SK',
      color: 'linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)',
      text: "Working with Care Med Billing has made our revenue cycle much easier to manage. They are responsive, detail-oriented, and proactive about resolving billing issues before they become bigger problems. Their support across medical billing, RPM, CCM, and related services has added real efficiency to our practice."
    },
    {
      name: 'Dr. Tanveer Khan',
      role: 'Family Practice',
      initials: 'TK',
      color: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
      text: "Care Med Billing provides the kind of hands-on support a busy primary care practice needs. From everyday claims and follow-up to RPM and CCM services, their team communicates clearly and keeps the process moving. I especially appreciate how accessible they are whenever we have a question or need something addressed quickly."
    },
    {
      name: 'Dr. Maryum Khawari',
      role: 'Rheumatologist',
      initials: 'MK',
      color: 'linear-gradient(135deg, #0369a1 0%, #06b6d4 100%)',
      text: "Care Med Billing has been a valuable resource for our practice. Their team is professional, attentive, and familiar with the billing challenges that come with specialty care. They have helped streamline our billing processes and provide reliable support with claims, follow-up, and ongoing patient-care programs such as RPM and CCM."
    }
  ];

  const testiTrack = document.getElementById('testimonialsTrack');
  const testiDots = document.getElementById('testiDots');
  const testiPrevBtn = document.getElementById('testiPrevBtn');
  const testiNextBtn = document.getElementById('testiNextBtn');
  const testiWrapper = document.getElementById('testimonialsCarousel');

  if (testiTrack && testiDots && testiPrevBtn && testiNextBtn && testiWrapper) {
    let testiIndex = 0;
    let testiCardsPerPage = window.innerWidth < 768 ? 1 : 2;
    let testiPaused = false;
    let testiTimer = null;

    function testiTotalPages() {
      return Math.ceil(testimonialsData.length / testiCardsPerPage);
    }

    function renderTestimonials() {
      const totalPages = testiTotalPages();
      if (testiIndex >= totalPages) testiIndex = 0;

      const start = testiIndex * testiCardsPerPage;
      const visible = testimonialsData.slice(start, start + testiCardsPerPage);

      testiTrack.innerHTML = visible.map(t => `
        <div class="card testi-card testimonial-card-item">
          <div>
            <i class="fas fa-quote-left testimonial-quote-icon"></i>
            <p class="testimonial-text">"${t.text}"</p>
          </div>
          <div class="testimonial-author-wrapper">
            <div class="testimonial-avatar-circle" style="background: ${t.color};">${t.initials}</div>
            <div class="testimonial-author">
              <span class="author-name">${t.name}</span>
              <span class="author-role">${t.role}</span>
            </div>
          </div>
        </div>
      `).join('');

      testiDots.innerHTML = '';
      for (let i = 0; i < totalPages; i++) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'indicator-dot' + (i === testiIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Go to testimonial page ${i + 1}`);
        dot.addEventListener('click', () => {
          testiIndex = i;
          renderTestimonials();
          restartTestiAutoRotate();
        });
        testiDots.appendChild(dot);
      }
    }

    function testiNext() {
      testiIndex = (testiIndex + 1) % testiTotalPages();
      renderTestimonials();
    }

    function testiPrev() {
      testiIndex = (testiIndex - 1 + testiTotalPages()) % testiTotalPages();
      renderTestimonials();
    }

    function restartTestiAutoRotate() {
      if (testiTimer) clearInterval(testiTimer);
      testiTimer = setInterval(() => {
        if (!testiPaused) testiNext();
      }, 5000);
    }

    testiNextBtn.addEventListener('click', () => { testiNext(); restartTestiAutoRotate(); });
    testiPrevBtn.addEventListener('click', () => { testiPrev(); restartTestiAutoRotate(); });
    testiWrapper.addEventListener('mouseenter', () => { testiPaused = true; });
    testiWrapper.addEventListener('mouseleave', () => { testiPaused = false; });

    window.addEventListener('resize', () => {
      const nextCardsPerPage = window.innerWidth < 768 ? 1 : 2;
      if (nextCardsPerPage !== testiCardsPerPage) {
        testiCardsPerPage = nextCardsPerPage;
        testiIndex = 0;
        renderTestimonials();
      }
    });

    renderTestimonials();
    restartTestiAutoRotate();
  }
});

// Real form submission handler (Web3Forms) — replaces prior no-op/native form
// submits on liveGetInTouchForm, newsletterFormTouch, and bookingForm.
document.addEventListener('DOMContentLoaded', () => {
  const WEB3FORMS_ACCESS_KEY = '1842b4f7-444c-4731-867e-e813d86ba4e4';

  function wireForm(formId, subject) {
    const form = document.getElementById(formId);
    if (!form) return;

    // Honeypot: Web3Forms drops any submission where this hidden box is ticked.
    // People never see it; bots that fill every field tick it.
    if (!form.querySelector('input[name="botcheck"]')) {
      const trap = document.createElement('input');
      trap.type = 'checkbox';
      trap.name = 'botcheck';
      trap.tabIndex = -1;
      trap.setAttribute('aria-hidden', 'true');
      trap.style.cssText = 'position:absolute;left:-9999px;width:1px;height:1px;opacity:0;';
      form.appendChild(trap);
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
      }

      const formData = new FormData(form);
      formData.append('access_key', WEB3FORMS_ACCESS_KEY);
      formData.append('subject', subject);
      // Web3Forms replies go to the visitor only if the field is literally "email".
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && !formData.get('email')) formData.append('email', emailInput.value);

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          if (window.Swal) {
            Swal.fire({ icon: 'success', title: 'Thank you!', text: 'Your request has been received. Our team will reach out shortly.' });
          } else {
            alert('Thank you! Your request has been received. Our team will reach out shortly.');
          }
          form.reset();
          const popup = document.getElementById('contactModal');
          if (popup) popup.classList.remove('active');
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        if (window.Swal) {
          Swal.fire({ icon: 'error', title: 'Something went wrong', text: 'Please try again or contact us directly by phone or email.' });
        } else {
          alert('Something went wrong submitting your request. Please try again or contact us directly by phone or email.');
        }
      } finally {
        if (submitBtn && originalBtnHtml !== null) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }

  wireForm('liveGetInTouchForm', 'CareMedBill — Get In Touch Form Submission');
  wireForm('newsletterFormTouch', 'CareMedBill — Newsletter Signup');
  wireForm('bookingForm', 'CareMedBill — Consultation Booking Request');
  wireForm('modalContactForm', 'CareMedBill — Free Audit Request (popup)');
  wireForm('contactForm', 'CareMedBill — Contact Form Submission');
  wireForm('newsletterForm', 'CareMedBill — Newsletter Signup');
});
