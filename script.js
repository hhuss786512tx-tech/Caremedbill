/**
 * Care Medical Billing & Management Services
 * Site behaviour (2026-10-19 redesign)
 *
 * Everything here is progressive enhancement: the page is fully readable with
 * JS disabled. `html.js` (set inline in <head>) is what allows the CSS to hide
 * reveal targets before they scroll in, and a 4s failsafe below shows anything
 * the observer missed.
 */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // The previous theme engine stored a dark-mode preference; the redesign is
  // single-theme, so clear any stale state so nothing styles itself as dark.
  document.documentElement.removeAttribute('data-theme');
  document.body.removeAttribute('data-theme');
  try { localStorage.removeItem('caremed_theme'); } catch (e) { /* storage blocked */ }

  // 1. Header shadow once the page has scrolled
  const header = document.getElementById('siteHeader') || document.querySelector('.site-header');
  if (header) {
    let ticking = false;
    const update = () => {
      header.classList.toggle('scrolled', window.scrollY > 8);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // 2. Mobile navigation drawer
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navScrim = document.getElementById('navScrim');
  if (mobileToggle && navLinks) {
    const desktop = window.matchMedia('(min-width: 1100px)');
    const isOpen = () => navLinks.classList.contains('active');

    function openMenu() {
      navLinks.classList.add('active');
      document.body.classList.add('nav-open');
      mobileToggle.setAttribute('aria-expanded', 'true');
      mobileToggle.setAttribute('aria-label', 'Close menu');
    }
    function closeMenu(returnFocus) {
      navLinks.classList.remove('active');
      document.body.classList.remove('nav-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
      mobileToggle.setAttribute('aria-label', 'Open menu');
      if (returnFocus) mobileToggle.focus();
    }

    mobileToggle.addEventListener('click', () => { isOpen() ? closeMenu() : openMenu(); });
    if (navScrim) navScrim.addEventListener('click', () => closeMenu());
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen()) closeMenu(true); });
    desktop.addEventListener('change', (e) => { if (e.matches && isOpen()) closeMenu(); });
  }

  // 3. Scroll reveal
  const revealSelector = [
    '.reveal-on-scroll', '.reveal', '.title-reveal', '.bass-reveal-left', '.bass-reveal-right',
    '.flip-card', '.bass-img-card', '.grid-3 > .card', '.content-hub-grid > .card', '.stagger',
  ].join(', ');
  const revealTargets = Array.from(document.querySelectorAll(revealSelector));
  const showAll = () => revealTargets.forEach((el) => { el.style.transitionDelay = '0s'; el.classList.add('is-visible'); });

  if (reduceMotion || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        const img = entry.target.querySelector('.bass-img-reveal');
        if (img) img.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach((el) => {
      // A flip face inside an already-observed card would double the stagger.
      if (el.closest('.flip-card') && el !== el.closest('.flip-card')) return;
      // Siblings in a grid cascade in; .stagger groups handle their own delays in CSS.
      if (!el.classList.contains('stagger') && !el.closest('.stagger')) {
        const i = Array.from(el.parentNode.children).indexOf(el);
        el.style.transitionDelay = `${(i % 4) * 0.09}s`;
      }
      io.observe(el);
    });

    // Failsafe: never leave content hidden if the observer misfires.
    window.setTimeout(showAll, 4000);
  }

  // 4. Short count-up on the hero facts (15+, 20+)
  const counters = document.querySelectorAll('.count[data-target]');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const start = performance.now();
        const dur = 900;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = prefix + Math.round(target * eased) + suffix;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        co.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  }

  // 5. FAQ: native <details>; opening one closes the others
  const faqItems = document.querySelectorAll('details.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) faqItems.forEach((other) => { if (other !== item) other.open = false; });
    });
  });
  // Legacy button-based accordion on older pages
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // 6. Flip cards: tap/click toggles on touch devices (hover handles desktop)
  document.querySelectorAll('.flip-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a') && !e.target.closest('button')) card.classList.toggle('is-flipped');
    });
  });

  // 7. Quick-request modal
  const modal = document.getElementById('contactModal');
  const closeModalBtn = document.getElementById('closeModal');
  let lastFocus = null;
  function openModal() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    const first = modal.querySelector('input, select, textarea');
    if (first) window.setTimeout(() => first.focus(), 60);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('.open-modal').forEach((btn) => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openModal(); });
  });
  if (modal) {
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('active')) closeModal(); });
  }

  // 8. Specialty search filter (specialities page)
  const searchInput = document.getElementById('searchFilterInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      document.querySelectorAll('.searchable-item').forEach((item) => {
        item.style.display = item.textContent.toLowerCase().includes(query) ? '' : 'none';
      });
    });
  }
});

// Real form submission handler (Web3Forms). Field names, endpoint and honeypot
// are unchanged from the previous build; do not alter without re-testing.
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
          if (popup) { popup.classList.remove('active'); popup.setAttribute('aria-hidden', 'true'); }
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
