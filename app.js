/**
 * Caremed Billing - Interactive Application Engine
 */

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

  // 7. Contact Form Handler (Web3Forms — real submission, not a fake alert)
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : null;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
      }

      const formData = new FormData(contactForm);
      formData.append('access_key', 'WEB3FORMS_ACCESS_KEY_PLACEHOLDER');
      formData.append('subject', 'CareMedBill — Contact Form Submission');

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          alert('Thank you! Your inquiry has been received. Our team will reach out within 2 hours.');
          if (modal) modal.classList.remove('active');
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Submission failed');
        }
      } catch (err) {
        alert('Something went wrong submitting your inquiry. Please try again or contact us directly by phone or email.');
      } finally {
        if (submitBtn && originalBtnHtml !== null) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHtml;
        }
      }
    });
  }
});
