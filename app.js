/**
 * Caremed Billing - Interactive Application Engine
 */

/* ---------------------------------------------------------------------------
 * LEAD DELIVERY CONFIG — keep LEAD_FORM_ID identical to the one in script.js.
 * See the comment block in script.js for the setup steps. Until a real ID is
 * set, this form does NOT claim success.
 * ------------------------------------------------------------------------- */
const LEAD_FORM_ID = 'REPLACE_WITH_FORMSPREE_ID';

const LEAD_FORM_ENDPOINT = 'https://formspree.io/f/' + LEAD_FORM_ID;
const LEAD_FORM_CONFIGURED = LEAD_FORM_ID.indexOf('REPLACE_WITH') !== 0;
const LEAD_FALLBACK_MESSAGE = 'We could not send that just now. Please call +1 888 865 5485 or email info@caremedbill.com and we will pick it up right away. Your details are still in the form below.';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark / Light Theme Toggle
  const themeToggleBtn = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggleBtn.textContent = newTheme === 'dark' ? '🌙' : '☀️';
    });
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // 3. Scroll Reveal Animation via IntersectionObserver
  const observerOptions = { threshold: 0.15, rootMargin: '0px 0px -50px 0px' };
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  // 4. FAQ Accordion Toggle
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });

  // 5. Interactive Cost / Scope Estimator Calculator
  const scopeSlider = document.getElementById('scopeSlider');
  const speedSlider = document.getElementById('speedSlider');
  const calcOutput = document.getElementById('calcOutput');

  function updateEstimate() {
    if (!scopeSlider || !speedSlider || !calcOutput) return;
    const scopeVal = parseInt(scopeSlider.value) || 1;
    const speedVal = parseInt(speedSlider.value) || 1;
    const baseRate = 2500;
    const total = Math.round(baseRate * scopeVal * (1.5 - (speedVal * 0.1)));
    calcOutput.textContent = '$' + total.toLocaleString();
  }

  if (scopeSlider) scopeSlider.addEventListener('input', updateEstimate);
  if (speedSlider) speedSlider.addEventListener('input', updateEstimate);
  updateEstimate();

  // 6. Contact Drawer / Modal Controls
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

  // 7. Contact Form Handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    if (LEAD_FORM_CONFIGURED) {
      contactForm.setAttribute('action', LEAD_FORM_ENDPOINT);
      contactForm.setAttribute('method', 'POST');
    }
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!LEAD_FORM_CONFIGURED) {
        console.warn('[caremedbill] LEAD_FORM_ID is not set in app.js — this submission was not delivered.');
        alert(LEAD_FALLBACK_MESSAGE);
        return;
      }

      const button = contactForm.querySelector('button[type="submit"]');
      const buttonHtml = button ? button.innerHTML : null;
      if (button) {
        button.disabled = true;
        button.innerHTML = 'Sending...';
      }

      const data = new FormData(contactForm);
      data.set('_subject', 'New website lead — portfolio consultation');
      data.set('page', window.location.pathname);

      fetch(LEAD_FORM_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (!response.ok) throw new Error('Lead endpoint returned ' + response.status);
          alert('Thank you! Your inquiry has been received. Our team will reach out within 2 hours.');
          if (modal) modal.classList.remove('active');
          contactForm.reset();
        })
        .catch(error => {
          console.error('[caremedbill] lead delivery failed:', error);
          alert(LEAD_FALLBACK_MESSAGE);
        })
        .finally(() => {
          if (button) {
            button.disabled = false;
            button.innerHTML = buttonHtml;
          }
        });
    });
  }
});
