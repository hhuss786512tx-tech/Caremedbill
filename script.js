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
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileToggle.contains(e.target)) {
        navLinks.classList.remove('active');
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
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
  const parallaxImgs = document.querySelectorAll('.parallax-img');

  function updateParallaxAndLiquidMotion() {
    const scrollY = window.scrollY;

    bgSlides.forEach(slide => {
      slide.style.transform = `scale(1.06) translateY(${scrollY * 0.42}px)`;
    });

    if (blobFrame) {
      const r1 = 60 + Math.sin(scrollY * 0.005) * 20;
      const r2 = 40 + Math.cos(scrollY * 0.006) * 20;
      const r3 = 70 + Math.sin(scrollY * 0.004) * 15;
      const r4 = 30 + Math.cos(scrollY * 0.007) * 25;
      blobFrame.style.borderRadius = `${r1}% ${100 - r1}% ${r3}% ${100 - r3}% / ${r2}% ${r4}% ${100 - r4}% ${100 - r2}%`;
    }

    gradientWords.forEach((word, idx) => {
      const shift = (scrollY * 0.18) + (idx * 20);
      word.style.backgroundPosition = `${shift % 300}% 50%`;
    });

    parallaxImgs.forEach(img => {
      const speed = parseFloat(img.getAttribute('data-speed')) || 0.15;
      const rect = img.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const yPos = (window.innerHeight - rect.top) * speed * 0.2;
        img.style.transform = `translateY(${yPos}px) scale(1.04)`;
      }
    });

    requestAnimationFrame(updateParallaxAndLiquidMotion);
  }
  requestAnimationFrame(updateParallaxAndLiquidMotion);

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

  const revealTargets = document.querySelectorAll('.title-reveal, .reveal-on-scroll, .reveal, .card, .bento-card, .service-card, .bass-img-card, .bass-reveal-left, .bass-reveal-right');
  revealTargets.forEach((el) => {
    const siblingIndex = Array.from(el.parentNode.children).indexOf(el);
    el.style.transitionDelay = `${(siblingIndex % 4) * 0.12}s`;
    revealObserver.observe(el);
  });

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

  // Intercept Form Submissions for Executive Practice Audit & Contact Forms
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (modal) modal.classList.remove('active');
      
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: 'Practice Audit Request Received!',
          text: 'Thank you for reaching out. Our Senior RCM Executive Specialists are reviewing your practice details and will contact you within 24 hours.',
          confirmButtonColor: '#0284c7',
          background: document.documentElement.getAttribute('data-theme') === 'dark' ? '#0f172a' : '#ffffff',
          color: document.documentElement.getAttribute('data-theme') === 'dark' ? '#f8fafc' : '#0f172a'
        });
      } else {
        alert('Thank you! Your audit request has been submitted successfully.');
      }
      
      form.reset();
    });
  });

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
});
