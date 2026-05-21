document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // 1. SCROLL PROGRESS BAR
  // =============================================
  const scrollProgress = document.createElement('div');
  scrollProgress.id = 'scroll-progress';
  document.body.prepend(scrollProgress);
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollProgress.style.width = docHeight > 0 ? `${(scrollTop / docHeight) * 100}%` : '0%';
  });

  // =============================================
  // 2. PRELOADER
  // =============================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      setTimeout(() => { preloader.style.display = 'none'; }, 500);
    });
  }

  // =============================================
  // 3. CUSTOM CURSOR
  // =============================================
  const cursorDot     = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  if (cursorDot && cursorOutline && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = `${e.clientX}px`;
      cursorDot.style.top  = `${e.clientY}px`;
      cursorOutline.animate(
        { left: `${e.clientX}px`, top: `${e.clientY}px` },
        { duration: 500, fill: 'forwards' }
      );
    });
    document.querySelectorAll('a, button, .filter-btn, .theme-toggle').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursorOutline.style.opacity   = '0.5';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.opacity   = '1';
      });
    });
  }

  // =============================================
  // 4. THEME TOGGLE
  // =============================================
  const themeToggle  = document.querySelector('.theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  if (themeToggle) {
    themeToggle.innerHTML = currentTheme === 'dark'
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
    themeToggle.addEventListener('click', () => {
      const theme    = document.documentElement.getAttribute('data-theme');
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      themeToggle.innerHTML = newTheme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
    });
  }

  // =============================================
  // 5. MOBILE MENU (with auto-close on link click)
  // =============================================
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks  = document.querySelector('.nav-links');
  if (mobileBtn && navLinks) {
    const toggleMenu = (forceClose = false) => {
      const isOpen = navLinks.classList.contains('active');
      const icon   = mobileBtn.querySelector('i');
      if (forceClose || isOpen) {
        navLinks.classList.remove('active');
        icon.classList.replace('fa-times', 'fa-bars');
      } else {
        navLinks.classList.add('active');
        icon.classList.replace('fa-bars', 'fa-times');
      }
    };
    mobileBtn.addEventListener('click', () => toggleMenu());
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(true));
    });
  }

  // =============================================
  // 6. STICKY NAV
  // =============================================
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // =============================================
  // 7. SCROLL TO TOP BUTTON
  // =============================================
  const scrollTopBtn = document.getElementById('scroll-top');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
    });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // =============================================
  // 8. PAGE TRANSITIONS (smooth fade between pages)
  // =============================================
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.endsWith('.html') && !href.startsWith('http') && !href.startsWith('//')) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        document.body.style.transition = 'opacity 0.3s ease';
        document.body.style.opacity    = '0';
        setTimeout(() => { window.location.href = href; }, 300);
      });
    }
  });
  // Fade in on page load
  document.body.style.opacity    = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { document.body.style.opacity = '1'; });
  });

  // =============================================
  // 9. RIPPLE EFFECT ON BUTTONS
  // =============================================
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${e.clientX - rect.left - size / 2}px;
        top:  ${e.clientY - rect.top  - size / 2}px;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // =============================================
  // 10. RESUME DOWNLOAD
  // =============================================
  const resumeBtn = document.getElementById('download-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Place your resume PDF as assets/resume.pdf to enable download
      fetch('assets/resume.pdf', { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            const a = document.createElement('a');
            a.href     = 'assets/resume.pdf';
            a.download = 'Sourabh_Mali_Resume.pdf';
            a.click();
            showToast('📄 Downloading resume...');
          } else {
            showToast('⚠️ Resume not available yet. Check back soon!');
          }
        })
        .catch(() => showToast('⚠️ Resume not available yet. Check back soon!'));
    });
  }

  // =============================================
  // 11. IMAGE ERROR FALLBACK
  // =============================================
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      this.style.display = 'none';
    });
  });

  // =============================================
  // 12. TYPED.JS
  // =============================================
  if (typeof Typed !== 'undefined' && document.querySelector('.typed-text')) {
    new Typed('.typed-text', {
      strings: ['Web Developer', 'Python Developer', 'JavaScript Developer', 'MCA Student'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 1500,
      loop: true
    });
  }

  // =============================================
  // 13. AOS INIT
  // =============================================
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 100 });
  }

  // =============================================
  // 14. PARTICLES.JS
  // =============================================
  if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: '#3b82f6' },
        shape: { type: 'circle' },
        opacity: { value: 0.3, random: false },
        size: { value: 3, random: true },
        line_linked: { enable: true, distance: 150, color: '#8b5cf6', opacity: 0.2, width: 1 },
        move: { enable: true, speed: 2, direction: 'none', random: false, straight: false, out_mode: 'out', bounce: false }
      },
      interactivity: {
        detect_on: 'canvas',
        events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
        modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } }
      },
      retina_detect: true
    });
  }

  // =============================================
  // 15. SKILL BARS ANIMATION
  // =============================================
  const skillBars = document.querySelectorAll('.progress');
  if (skillBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.getAttribute('data-width');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    skillBars.forEach(bar => skillObserver.observe(bar));
  }

  // =============================================
  // 16. COUNTER ANIMATION (smart — skips huge year numbers)
  // =============================================
  const counters = document.querySelectorAll('.counter');
  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target   = +entry.target.getAttribute('data-target');
          const duration = 1500;
          const steps    = 60;
          const inc      = target / steps;
          let   count    = 0;
          const update   = () => {
            count = Math.min(count + inc, target);
            entry.target.innerText = Math.ceil(count);
            if (count < target) setTimeout(update, duration / steps);
          };
          update();
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // =============================================
  // 17. PROJECT FILTER
  // =============================================
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const projectCards  = document.querySelectorAll('.project-card[data-category]');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
          const cats = card.getAttribute('data-category') || '';
          const show = filter === 'all' || cats.includes(filter);
          card.style.transition = 'opacity 0.3s, transform 0.3s';
          if (show) {
            card.style.opacity   = '1';
            card.style.transform = 'scale(1)';
            card.style.display   = '';
          } else {
            card.style.opacity   = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              if (btn.classList.contains('active') || filter !== 'all') {
                card.style.display = btn.getAttribute('data-filter') === filter ? 'none' : '';
              }
            }, 300);
          }
        });
      });
    });
  }

});

// =============================================
// SHOW TOAST (global helper)
// =============================================
function showToast(message) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
}
