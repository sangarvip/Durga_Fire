/**
 * Durga Fire & Safety Consultants — Main Script
 * Features: sticky header, mobile nav, dropdown, scroll reveal,
 *           counter animation, hero particles, form handling,
 *           back-to-top, cookie banner, scroll progress bar.
 */

'use strict';

/* ════════════════════════════════════════════════════
   DOM READY
════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  initHeader();
  initMobileNav();
  initDropdowns();
  initScrollReveal();
  initCounters();
  initHeroParticles();
  initConsultModal();
  initBackToTop();
  initScrollProgress();
  initCookieBanner();
  injectExtras();

});

/* ════════════════════════════════════════════════════
   INJECT EXTRAS.CSS
════════════════════════════════════════════════════ */
function injectExtras() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'extras.css';
  document.head.appendChild(link);
}

/* ════════════════════════════════════════════════════
   STICKY HEADER
════════════════════════════════════════════════════ */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', 'Page scroll progress');
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled   = window.scrollY;
    const pct = scrollable > 0 ? (scrolled / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
}

/* ════════════════════════════════════════════════════
   MOBILE NAV
════════════════════════════════════════════════════ */
function initMobileNav() {
  const hamburger   = document.getElementById('hamburger');
  const mobileNav   = document.getElementById('mobileNav');
  const mobileClose = document.getElementById('mobileNavClose');
  if (!hamburger || !mobileNav) return;

  const openNav = () => {
    mobileNav.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };
  const closeNav = () => {
    mobileNav.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openNav);
  if (mobileClose) mobileClose.addEventListener('click', closeNav);

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on overlay click (outside nav)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });
}

/* ════════════════════════════════════════════════════
   DESKTOP DROPDOWN NAVIGATION
════════════════════════════════════════════════════ */
function initDropdowns() {
  const items = document.querySelectorAll('.nav-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.dropdown-trigger');
    const menu    = item.querySelector('.dropdown-menu');
    if (!trigger || !menu) return;

    const open = () => {
      // Close all others first
      items.forEach(i => {
        if (i !== item) {
          i.classList.remove('open');
          i.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
      item.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
    };

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      item.classList.contains('open') ? close() : open();
    });

    // Close when clicking outside
    document.addEventListener('click', close);
    item.addEventListener('click', e => e.stopPropagation());

    // Keyboard accessibility
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.classList.contains('open') ? close() : open();
      }
      if (e.key === 'Escape') close();
    });
  });
}

/* ════════════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ════════════════════════════════════════════════════
   COUNTER ANIMATION
════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el, target, duration = 2000) => {
    const start = performance.now();

    const update = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.floor(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString();
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        if (!isNaN(target)) animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ════════════════════════════════════════════════════
   HERO PARTICLES (animated floating embers)
════════════════════════════════════════════════════ */
function initHeroParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = 28;
  const colors = [
    'rgba(224,52,42,0.65)',
    'rgba(255,120,50,0.50)',
    'rgba(255,200,80,0.40)',
    'rgba(224,52,42,0.35)',
    'rgba(255,80,40,0.55)',
  ];

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size  = Math.random() * 7 + 3;   // 3–10px
    const left  = Math.random() * 100;      // % from left
    const delay = Math.random() * 12;       // s delay
    const dur   = Math.random() * 10 + 8;  // 8–18s duration
    const color = colors[Math.floor(Math.random() * colors.length)];

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: 0;
      background: ${color};
      box-shadow: 0 0 ${size * 2}px ${color};
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    `;
    container.appendChild(p);
  }
}

/* ════════════════════════════════════════════════════
   CONSULTATION MODAL
════════════════════════════════════════════════════ */
function initConsultModal() {
  const overlay   = document.getElementById('consultModal');
  const closeBtn  = document.getElementById('modalClose');
  const form      = document.getElementById('consultForm');
  const openBtns  = [
    document.getElementById('heroConsultBtn'),
    document.getElementById('aboutConsultBtn'),
  ];

  if (!overlay) return;

  const open = () => {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // Focus first input
    setTimeout(() => {
      overlay.querySelector('input')?.focus();
    }, 300);
  };

  const close = () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  openBtns.forEach(btn => btn?.addEventListener('click', open));
  closeBtn?.addEventListener('click', close);

  overlay.addEventListener('click', e => {
    if (e.target === overlay) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) close();
  });

  // Form submission
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('formSubmit');

    // Basic validation
    const name    = document.getElementById('fname')?.value.trim();
    const company = document.getElementById('company')?.value.trim();
    const phone   = document.getElementById('phone')?.value.trim();
    const email   = document.getElementById('email')?.value.trim();

    if (!name || !company || !phone || !email) {
      showFormError('Please fill in all required fields.');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      showFormError('Please enter a valid email address.');
      return;
    }

    // Show loading state
    if (submitBtn) {
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;
    }

    // Simulate async send (replace with actual fetch/EmailJS in production)
    await new Promise(r => setTimeout(r, 1400));

    // Show success
    const modalBody = overlay.querySelector('.modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="form-success">
          <span class="success-icon">✅</span>
          <h3>Request Received!</h3>
          <p>Thank you, <strong>${escapeHtml(name)}</strong>. Our team will contact you within 24 hours to schedule your free safety consultation.</p>
          <p style="margin-top:12px; font-size:0.82rem; color:#8892A4;">For urgent matters, call us directly: <a href="tel:+91XXXXXXXXXX" style="color:#E0342A; font-weight:600;">+91 XXXXXXXXXX</a></p>
        </div>
      `;
    }

    // Auto-close after 4 seconds
    setTimeout(close, 4000);
  });
}

function showFormError(msg) {
  const existing = document.querySelector('.form-error-msg');
  if (existing) existing.remove();
  const err = document.createElement('p');
  err.className = 'form-error-msg';
  err.style.cssText = 'color:#E0342A; font-size:0.83rem; margin-bottom:10px; font-weight:500;';
  err.textContent = msg;
  document.getElementById('consultForm')?.prepend(err);
  setTimeout(() => err.remove(), 4000);
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

/* ════════════════════════════════════════════════════
   BACK TO TOP
════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'backToTop';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ════════════════════════════════════════════════════
   COOKIE BANNER
════════════════════════════════════════════════════ */
function initCookieBanner() {
  if (localStorage.getItem('cookiesAccepted')) return;

  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Cookie consent');
  banner.innerHTML = `
    <p>
      We use cookies to improve your experience and analyze site traffic.
      By continuing, you agree to our <a href="privacy.html">Privacy Policy</a>.
    </p>
    <div class="cookie-btns">
      <button class="btn btn-primary" id="cookieAccept" style="padding:10px 22px; font-size:0.82rem;">Accept All</button>
      <button class="btn btn-outline-white" id="cookieDecline" style="padding:10px 22px; font-size:0.82rem; border-color:rgba(255,255,255,0.30); color:rgba(255,255,255,0.65);">Decline</button>
    </div>
  `;
  document.body.appendChild(banner);

  setTimeout(() => banner.classList.add('show'), 1200);

  const dismiss = (accepted) => {
    banner.classList.remove('show');
    if (accepted) localStorage.setItem('cookiesAccepted', '1');
    setTimeout(() => banner.remove(), 600);
  };

  document.getElementById('cookieAccept')?.addEventListener('click', () => dismiss(true));
  document.getElementById('cookieDecline')?.addEventListener('click', () => dismiss(false));
}

/* ════════════════════════════════════════════════════
   ACTIVE NAV LINK ON SCROLL (single-page sections)
════════════════════════════════════════════════════ */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu a');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active-scroll');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active-scroll');
      }
    });
  }, { passive: true });
})();
