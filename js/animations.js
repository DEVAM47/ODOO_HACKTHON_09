/* ============================================
   TRAVELOOP — Animation Engine
   ============================================ */

const TLAnimations = (() => {
  /* ── Spring Physics Solver ── */
  function springAnimate(el, prop, from, to, { stiffness = 180, damping = 20, mass = 1, onDone } = {}) {
    let pos = from, vel = 0;
    const loop = () => {
      const force = -stiffness * (pos - to);
      const damp = -damping * vel;
      const acc = (force + damp) / mass;
      vel += acc * 0.016;
      pos += vel * 0.016;
      el.style[prop] = typeof to === 'number' && prop !== 'opacity' ? `${pos}px` : pos;
      if (Math.abs(pos - to) > 0.01 || Math.abs(vel) > 0.01) {
        requestAnimationFrame(loop);
      } else {
        el.style[prop] = typeof to === 'number' && prop !== 'opacity' ? `${to}px` : to;
        if (onDone) onDone();
      }
    };
    requestAnimationFrame(loop);
  }

  /* ── Scroll Reveal Observer ── */
  let scrollObserver;
  function initScrollAnimations() {
    if (scrollObserver) scrollObserver.disconnect();
    scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Count-up numbers
          if (entry.target.dataset.countTo) {
            animateCount(entry.target, 0, parseInt(entry.target.dataset.countTo), 1500);
          }
          // Bar charts
          if (entry.target.classList.contains('chart-bar-animate')) {
            const h = entry.target.dataset.height;
            entry.target.style.transform = `scaleY(1)`;
          }
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    requestAnimationFrame(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => scrollObserver.observe(el));
    });
  }

  /* ── Count-Up Animator ── */
  function animateCount(el, from, to, duration = 1500) {
    const start = performance.now();
    const formatter = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(from + (to - from) * eased);
      el.textContent = formatter + val.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ── Ripple Effect ── */
  function createRipple(e) {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    const existing = btn.querySelector('.ripple');
    if (existing) existing.remove();
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }

  /* ── Attach Ripples ── */
  function initRipples() {
    document.querySelectorAll('.btn-primary, .btn-fab, .ripple-container').forEach(btn => {
      btn.removeEventListener('click', createRipple);
      btn.addEventListener('click', createRipple);
    });
  }

  /* ── Card Hover (Spring) ── */
  function initCardHover() {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease';
      });
    });
  }

  /* ── Parallax Tilt (Login Hero) ── */
  function initParallaxTilt(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transition = 'transform 0.5s var(--ease-out-expo)';
      el.style.transform = 'perspective(800px) rotateY(0) rotateX(0)';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  }

  /* ── Image Lazy Load w/ Blur-to-Sharp ── */
  let imgObserver;
  function initLazyImages() {
    if (imgObserver) imgObserver.disconnect();
    imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.onload = () => img.classList.add('loaded');
          }
          imgObserver.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('.lazy-image').forEach(img => imgObserver.observe(img));
  }

  /* ── Toast Notifications ── */
  function showToast(message, type = 'success', duration = 5000) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${message}</span><div class="toast-progress"></div>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('dismissing');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /* ── Stagger Children ── */
  function staggerChildren(parent, delay = 80) {
    if (!parent) return;
    const children = parent.children;
    for (let i = 0; i < children.length; i++) {
      children[i].style.opacity = '0';
      children[i].style.transform = 'translateY(20px)';
      children[i].style.transition = `opacity 0.4s cubic-bezier(0.16,1,0.3,1) ${i * delay}ms, transform 0.4s cubic-bezier(0.16,1,0.3,1) ${i * delay}ms`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          children[i].style.opacity = '1';
          children[i].style.transform = 'translateY(0)';
        });
      });
    }
  }

  /* ── Skeleton Loader ── */
  function showSkeleton(container, type = 'cards', count = 3) {
    let html = '';
    for (let i = 0; i < count; i++) {
      if (type === 'cards') {
        html += `<div class="skeleton skeleton-card"></div>`;
      } else if (type === 'text') {
        html += `<div class="skeleton skeleton-title"></div>
                  <div class="skeleton skeleton-text w-80"></div>
                  <div class="skeleton skeleton-text w-60"></div>
                  <div class="skeleton skeleton-text w-40"></div>`;
      } else if (type === 'stats') {
        html += `<div class="stat-card"><div class="skeleton skeleton-text w-40"></div><div class="skeleton skeleton-title"></div></div>`;
      }
    }
    container.innerHTML = html;
  }

  function removeSkeleton(container, newContent) {
    container.style.opacity = '0';
    container.style.transition = 'opacity 0.2s ease';
    setTimeout(() => {
      container.innerHTML = newContent;
      container.style.opacity = '1';
      initAfterRender();
    }, 200);
  }

  /* ── Init After Each Page Render ── */
  function initAfterRender() {
    requestAnimationFrame(() => {
      initScrollAnimations();
      initRipples();
      initCardHover();
      initLazyImages();
    });
  }

  /* ── Checkbox Stroke-Draw ── */
  function toggleCheckbox(el) {
    el.classList.toggle('checked');
    if (el.classList.contains('checked')) {
      el.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14"><polyline points="2,7 6,11 12,3" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:24;stroke-dashoffset:24;animation:checkDraw 0.3s 0.1s forwards"/></svg>`;
    } else {
      el.innerHTML = '';
    }
  }

  /* ── Public API ── */
  return {
    springAnimate,
    initScrollAnimations,
    initRipples,
    initCardHover,
    initParallaxTilt,
    initLazyImages,
    animateCount,
    createRipple,
    showToast,
    staggerChildren,
    showSkeleton,
    removeSkeleton,
    initAfterRender,
    toggleCheckbox
  };
})();
