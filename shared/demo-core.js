export function initDemo({ name, onAction } = {}) {
  const banner = document.querySelector('[data-concept-banner]');
  if (banner) banner.setAttribute('aria-label', `${name || 'Website'}: fictional portfolio concept`);

  document.querySelectorAll('[data-mock-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const status = form.querySelector('[data-form-status]');
      if (status) status.textContent = 'Demo complete: nothing was sent or stored.';
      if (typeof onAction === 'function') onAction('form-complete', form);
    });
  });

  document.querySelectorAll('[data-dialog-open]').forEach((button) => {
    button.addEventListener('click', () => document.getElementById(button.dataset.dialogOpen)?.showModal());
  });
  document.querySelectorAll('[data-dialog-close]').forEach((button) => {
    button.addEventListener('click', () => button.closest('dialog')?.close());
  });

  document.querySelectorAll('dialog').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
  });

  initExperience();
}

function initExperience() {
  if (document.documentElement.dataset.experienceReady) return;
  document.documentElement.dataset.experienceReady = 'true';
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const reducedMotion = motionQuery.matches;

  const progress = document.createElement('div');
  progress.className = 'page-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const updateProgress = () => {
    const available = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty('--page-progress', `${available > 0 ? Math.min(100, scrollY / available * 100) : 0}%`);
  };
  updateProgress();
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress, { passive: true });

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = [...document.querySelectorAll('main > section, main > .marquee, body > footer')];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });
    revealTargets.forEach((target) => {
      target.classList.add('reveal-pending');
      observer.observe(target);
    });
  }

  const links = [...document.querySelectorAll('nav a[href^="#"]')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      links.forEach((link) => link.removeAttribute('aria-current'));
      document.querySelector(`nav a[href="#${CSS.escape(current.target.id)}"]`)?.setAttribute('aria-current', 'location');
    }, { threshold: [0.2, 0.55], rootMargin: '-18% 0px -62% 0px' });
    sections.forEach((section) => navObserver.observe(section));
  }

  requestAnimationFrame(() => document.body.classList.add('experience-ready'));
}

export function initSlideshow(selector, interval = 5200) {
  const root = document.querySelector(selector);
  if (!root) return;
  const slides = [...root.querySelectorAll('[data-slide]')];
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  if (slides.length < 2 || motionQuery.matches) return;
  let index = 0;
  let timer;
  const advance = () => {
    slides[index].classList.remove('is-active');
    index = (index + 1) % slides.length;
    slides[index].classList.add('is-active');
  };
  const stop = () => {
    if (!timer) return;
    clearInterval(timer);
    timer = undefined;
  };
  const start = () => {
    stop();
    if (document.hidden || motionQuery.matches || root.matches(':hover') || root.matches(':focus-within')) return;
    timer = window.setInterval(advance, interval);
  };
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', () => requestAnimationFrame(start));
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  motionQuery.addEventListener?.('change', start);
  start();
}

export function initTabs(selector, callback) {
  const root = document.querySelector(selector);
  if (!root) return;
  const activate = (tab) => {
    root.querySelectorAll('[data-tab]').forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    callback?.(tab.dataset.tab, tab);
  };
  root.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-tab]');
    if (!tab) return;
    activate(tab);
  });
  root.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const tabs = [...root.querySelectorAll('[data-tab]:not([hidden])')];
    const current = Math.max(0, tabs.indexOf(document.activeElement));
    let next = current;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % tabs.length;
    else next = (current - 1 + tabs.length) % tabs.length;
    event.preventDefault();
    tabs[next].focus();
    activate(tabs[next]);
  });
  const selected = root.querySelector('[data-tab][aria-selected="true"]') || root.querySelector('[data-tab]');
  root.querySelectorAll('[data-tab]').forEach((tab) => { tab.tabIndex = tab === selected ? 0 : -1; });
}

const panelTimers = new WeakMap();
export function swapMotionPanel(element, update) {
  if (!element || typeof update !== 'function') return;
  const previous = panelTimers.get(element);
  if (previous) clearTimeout(previous);
  update();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  element.dataset.motionPanel = '';
  element.classList.add('is-updating');
  const timer = window.setTimeout(() => {
    element.classList.remove('is-updating');
    panelTimers.delete(element);
  }, 20);
  panelTimers.set(element, timer);
}

export function money(value) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);
}

