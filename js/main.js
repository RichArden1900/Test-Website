/* ─────────────────────────────────────────────
   ETERNITY EVENT ORGANIZER — Main JavaScript
───────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── DARK MODE TOGGLE ── */
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;

  let currentTheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', currentTheme);
  updateToggleIcon();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', currentTheme);
      themeToggle.setAttribute('aria-label', `Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`);
      updateToggleIcon();
    });
  }

  function updateToggleIcon() {
    if (!themeToggle) return;
    themeToggle.innerHTML =
      currentTheme === 'dark'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  /* ── STICKY HEADER ── */
  const header = document.getElementById('header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > 80) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
    if (current > lastScroll && current > 300) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }
    lastScroll = current;
  }, { passive: true });

  /* ── MOBILE MENU ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger && hamburger.classList.remove('open');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ── PORTFOLIO FILTER ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ── SCROLL REVEAL ── */
  const revealTargets = document.querySelectorAll('.service-card, .portfolio-item, .testimonial-card, .about-grid, .contact-grid, .section-header');

  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, i * 60);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ── CONTACT FORM ── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect form data for WhatsApp message
      const name = contactForm.name.value;
      const phone = contactForm.phone.value;
      const eventType = contactForm.querySelector('#event-type').value;
      const eventDate = contactForm.querySelector('#event-date').value;
      const message = contactForm.message.value;

      const eventLabels = {
        sweet17: 'Sweet Seventeen',
        wedding: 'Wedding',
        corporate: 'Corporate Event',
        other: 'Lainnya'
      };

      const waText = encodeURIComponent(
        `Halo Eternity Event Organizer! 👋\n\n` +
        `Nama: ${name}\n` +
        `No. WA: ${phone}\n` +
        `Jenis Acara: ${eventLabels[eventType] || eventType}\n` +
        (eventDate ? `Tanggal Acara: ${eventDate}\n` : '') +
        (message ? `\nPesan:\n${message}` : '') +
        `\n\n#NowTillEternity`
      );

      const waURL = `https://api.whatsapp.com/send/?phone=6282216361416&text=${waText}&type=phone_number&app_absent=0`;

      // Show success state
      contactForm.querySelector('.btn-full').disabled = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // Open WhatsApp
      setTimeout(() => {
        window.open(waURL, '_blank', 'noopener');
      }, 800);

      // Reset form after 4s
      setTimeout(() => {
        contactForm.reset();
        contactForm.querySelector('.btn-full').disabled = false;
        formSuccess.hidden = true;
      }, 4000);
    });
  }

  /* ── SMOOTH ACTIVE NAV LINK ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(section => sectionObserver.observe(section));

  /* ── FADE-IN ANIMATION ── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .nav-link.active { color: var(--color-text); }
    .nav-link.active::after { width: 100%; }
  `;
  document.head.appendChild(style);

})();
