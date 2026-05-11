/**
 * Calvin Daniel — Personal Brand
 * script.js
 *
 * Modules:
 *  1. Reduced-motion gate
 *  2. Off-canvas menu
 *  3. Sticky header
 *  4. Scroll-triggered reveal (directional variants)
 *  5. Hero count-up stats
 *  6. Skill bars
 *  7. Smooth scroll
 *  8. Lazy background images
 *  9. Hero particle canvas
 * 10. Hero headline split letter stagger
 * 11. Hero eyebrow typewriter
 * 12. Section heading scramble
 * 13. Scroll progress bar
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────────────────
   * 1. REDUCED-MOTION GATE
   * ───────────────────────────────────────────────────────── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ─────────────────────────────────────────────────────────
   * 2. OFF-CANVAS MENU
   * ───────────────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const offCanvas  = document.getElementById('off-canvas-nav');
  const overlay    = document.getElementById('overlay');
  const closeBtn   = document.getElementById('off-canvas-close');
  const ocLinks    = document.querySelectorAll('.oc-link');

  const openMenu = () => {
    hamburger.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    offCanvas.classList.add('active');
    offCanvas.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    offCanvas.classList.remove('active');
    offCanvas.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  ocLinks.forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && offCanvas.classList.contains('active')) closeMenu();
  });


  /* ─────────────────────────────────────────────────────────
   * 3. STICKY HEADER
   * ───────────────────────────────────────────────────────── */
  const header = document.getElementById('site-header');

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();


  /* ─────────────────────────────────────────────────────────
   * 4. SCROLL-TRIGGERED REVEAL — directional variants
   *
   *    Add data-reveal="left" | "right" | "fade" to any
   *    .reveal element for a directional entrance.
   *    Default is "up" (existing translateY behaviour).
   * ───────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  revealEls.forEach(el => {
    if (prefersReduced) return;
    const dir = el.dataset.reveal || 'up';
    switch (dir) {
      case 'left':  el.style.transform = 'translateX(-36px)'; break;
      case 'right': el.style.transform = 'translateX(36px)';  break;
      case 'fade':  el.style.transform = 'none';              break;
      default:      el.style.transform = 'translateY(28px)';  break;
    }
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = prefersReduced ? '0s' : `${idx * 0.08}s`;
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ─────────────────────────────────────────────────────────
   * 5. HERO COUNT-UP STATS
   * ───────────────────────────────────────────────────────── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const countUp = (el) => {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1200;
    const start    = performance.now();
    const update   = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const heroStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(el => countUp(el));
        heroStatsObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroStatsObserver.observe(heroStats);


  /* ─────────────────────────────────────────────────────────
   * 6. SKILL BARS
   * ───────────────────────────────────────────────────────── */
  const toolBars = document.querySelectorAll('.tool-bar[data-width]');

  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute('data-width');
        bar.style.setProperty('--bar-target-width', width + '%');
        bar.style.width = width + '%';
        barObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  toolBars.forEach(bar => barObserver.observe(bar));


  /* ─────────────────────────────────────────────────────────
   * 7. SMOOTH SCROLL
   * ───────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerOffset = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--header-h'), 10
        ) || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────────────────────────────
   * 8. LAZY BACKGROUND IMAGES
   * ───────────────────────────────────────────────────────── */
  const lazyBgs = document.querySelectorAll('[data-bg]');

  if (lazyBgs.length) {
    const bgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.backgroundImage = `url(${entry.target.dataset.bg})`;
          bgObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    lazyBgs.forEach(el => bgObserver.observe(el));
  }


  /* ─────────────────────────────────────────────────────────
   * 9. HERO PARTICLE CANVAS
   *
   *    Sparse drifting dots on the hero background.
   *    Dots that come within 120px draw a faint connector.
   *    Colors: white, orange, soft blue — Mets palette.
   *    Pauses via IntersectionObserver when off-screen.
   * ───────────────────────────────────────────────────────── */
  const heroSection = document.querySelector('.hero');

  if (heroSection && !prefersReduced) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = [
      'position:absolute', 'inset:0', 'width:100%', 'height:100%',
      'pointer-events:none', 'z-index:0', 'opacity:0',
      'transition:opacity 1.4s ease'
    ].join(';');

    heroSection.insertBefore(canvas, heroSection.firstChild);
    const ctx = canvas.getContext('2d');

    const COLORS       = ['rgba(255,255,255,0.6)', 'rgba(255,89,16,0.55)', 'rgba(100,160,255,0.5)'];
    const CONNECT_DIST = 120;
    const COUNT        = 55;
    let particles      = [];
    let raf            = null;

    const rand = (a, b) => Math.random() * (b - a) + a;

    const resize = () => {
      canvas.width  = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    };

    const spawn = () => {
      particles = Array.from({ length: COUNT }, () => ({
        x:     rand(0, canvas.width),
        y:     rand(0, canvas.height),
        vx:    rand(-0.18, 0.18),
        vy:    rand(-0.18, 0.18),
        r:     rand(1.2, 2.5),
        color: COLORS[Math.floor(rand(0, COLORS.length))],
        alpha: rand(0.4, 0.9),
      }));
    };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Connection lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < CONNECT_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / CONNECT_DIST) * 0.15})`;
            ctx.lineWidth   = 0.7;
            ctx.stroke();
          }
        }
      }

      // Dots
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10)                 p.x = canvas.width + 10;
        if (p.x > canvas.width + 10)   p.x = -10;
        if (p.y < -10)                 p.y = canvas.height + 10;
        if (p.y > canvas.height + 10)  p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle   = p.color;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      raf = requestAnimationFrame(tick);
    };

    // Pause when hero scrolls off screen
    new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!raf) tick();
        } else {
          cancelAnimationFrame(raf);
          raf = null;
        }
      });
    }, { threshold: 0 }).observe(heroSection);

    // Respond to hero resize (orientation changes, etc.)
    new ResizeObserver(() => { resize(); spawn(); }).observe(heroSection);

    resize();
    spawn();
    tick();
    requestAnimationFrame(() => { canvas.style.opacity = '1'; });
  }


  /* ─────────────────────────────────────────────────────────
   * 10. HERO HEADLINE — SPLIT LETTER STAGGER
   *
   *     Each of the three headline lines (.line-1/2/3)
   *     has its characters wrapped in individual <span>s.
   *     They cascade in with a translateY + opacity transition,
   *     staggered per character and per line.
   * ───────────────────────────────────────────────────────── */
  const heroHeadline = document.querySelector('.hero-headline');

  if (heroHeadline && !prefersReduced) {
    const lines = heroHeadline.querySelectorAll('.line-1, .line-2, .line-3');

    lines.forEach((line, lineIdx) => {
      const text      = line.textContent;
      const lineDelay = lineIdx * 130;
      line.textContent = '';

      [...text].forEach((char, charIdx) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = [
          'display:inline-block',
          'opacity:0',
          'transform:translateY(0.45em)',
          'transition:opacity 0.45s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)',
          `transition-delay:${lineDelay + charIdx * 26}ms`
        ].join(';');
        line.appendChild(span);
      });
    });

    // Fire after a short paint delay
    setTimeout(() => {
      heroHeadline.querySelectorAll('span').forEach(span => {
        span.style.opacity   = '1';
        span.style.transform = 'translateY(0)';
      });
      heroHeadline.classList.add('in-view');
    }, 180);
  }


  /* ─────────────────────────────────────────────────────────
   * 11. HERO EYEBROW — TYPEWRITER
   *
   *     Types the eyebrow text character by character.
   *     A blinking orange cursor trails the text and
   *     fades out once typing completes.
   * ───────────────────────────────────────────────────────── */
  const heroEyebrow = document.querySelector('.hero .hero-eyebrow');

  if (heroEyebrow && !prefersReduced) {
    const fullText = heroEyebrow.textContent.trim();
    heroEyebrow.textContent = '';
    heroEyebrow.style.opacity = '1'; // override .reveal initial state

    // Inject blink keyframes once
    if (!document.getElementById('cd-blink-style')) {
      const s = document.createElement('style');
      s.id = 'cd-blink-style';
      s.textContent = '@keyframes cd-blink{0%,100%{opacity:1}50%{opacity:0}}';
      document.head.appendChild(s);
    }

    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.cssText = [
      'opacity:1',
      'animation:cd-blink 0.75s step-end infinite',
      'color:#FF5910',
      'font-weight:300',
      'margin-left:1px'
    ].join(';');
    heroEyebrow.appendChild(cursor);

    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < fullText.length) {
        heroEyebrow.insertBefore(document.createTextNode(fullText[i]), cursor);
        i++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          cursor.style.animation = 'none';
          cursor.style.opacity   = '0';
          cursor.style.transition = 'opacity 0.3s ease';
          setTimeout(() => cursor.remove(), 300);
        }, 1400);
      }
    }, 46);
  }


  /* ─────────────────────────────────────────────────────────
   * 12. SECTION HEADING SCRAMBLE
   *
   *     When each .section-heading enters the viewport it
   *     scrambles through random uppercase characters before
   *     resolving left-to-right to its real text.
   *     Skips the hero headline (handled above).
   * ───────────────────────────────────────────────────────── */
  if (!prefersReduced) {
    const CHARS    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@$%&';
    const DURATION = 580;
    const RATE     = 38;

    const scramble = (el) => {
      const originalHTML = el.innerHTML;
      const originalText = el.innerText;
      let frame = 0;
      const total = Math.round(DURATION / RATE);

      const iv = setInterval(() => {
        frame++;
        const revealed = Math.floor((frame / total) * originalText.length);
        let out = '';

        for (let i = 0; i < originalText.length; i++) {
          const ch = originalText[i];
          if (ch === '\n' || ch === ' ') {
            out += ch;
          } else if (i < revealed) {
            out += ch;
          } else {
            out += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        el.innerHTML = out.replace(/\n/g, '<br>');

        if (frame >= total) {
          clearInterval(iv);
          el.innerHTML = originalHTML;
        }
      }, RATE);
    };

    const headings = document.querySelectorAll('.section-heading');
    const scrambleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => scramble(entry.target), 160);
          scrambleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    headings.forEach(h => scrambleObserver.observe(h));
  }


  /* ─────────────────────────────────────────────────────────
   * 13. SCROLL PROGRESS BAR
   *
   *     A 3px wide orange bar grows down the left edge of
   *     the viewport as the user scrolls through the page.
   * ───────────────────────────────────────────────────────── */
  const progressBar = document.createElement('div');
  progressBar.setAttribute('aria-hidden', 'true');
  progressBar.style.cssText = [
    'position:fixed', 'top:0', 'left:0', 'width:3px', 'height:0%',
    'background:linear-gradient(to bottom,#FF5910,rgba(255,89,16,0.35))',
    'z-index:9999', 'border-radius:0 0 2px 0', 'pointer-events:none',
    'transition:height 0.06s linear'
  ].join(';');
  document.body.appendChild(progressBar);

  const updateProgress = () => {
    const scrolled  = window.scrollY;
    const total     = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.height = (total > 0 ? (scrolled / total) * 100 : 0) + '%';
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

});
