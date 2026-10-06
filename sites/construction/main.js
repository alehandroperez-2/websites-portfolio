import '../../shared/base.css';
import './style.css';
import './motion.css';
import { initDemo } from '../../shared/demo-core.js';

initDemo({ name: 'Forge & Field Command Center' });

const hero = document.querySelector('.command-hero');
const slides = [...hero.querySelectorAll('[data-slide]')];
const current = document.querySelector('#slide-current');
const announcement = document.querySelector('#slide-announcement');
const pauseButton = document.querySelector('[data-slide-pause]');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let index = 0;
let paused = reducedMotion;
let timer;

if (paused) {
  pauseButton.setAttribute('aria-pressed', 'true');
  pauseButton.textContent = 'Play';
}

function showSlide(next, announce = true) {
  index = (next + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    const active = slideIndex === index;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  const slide = slides[index];
  current.textContent = String(index + 1).padStart(2, '0');
  document.querySelector('#status-title').textContent = slide.dataset.title;
  document.querySelector('#status-location').textContent = slide.dataset.location;
  document.querySelector('#status-sector').textContent = slide.dataset.sector;
  document.querySelector('#status-progress').textContent = `${slide.dataset.progress}%`;
  document.querySelector('#status-bar').style.width = `${slide.dataset.progress}%`;
  const panel = document.querySelector('.command-panel');
  panel.classList.remove('status-updated');
  requestAnimationFrame(() => panel.classList.add('status-updated'));
  if (announce) announcement.textContent = `Showing ${slide.dataset.title}`;
}

function restartTimer() {
  clearInterval(timer);
  if (!paused && !document.hidden && !hero.matches(':hover') && !hero.matches(':focus-within')) timer = setInterval(() => showSlide(index + 1, false), 7000);
}

document.querySelector('[data-slide-next]').addEventListener('click', () => { showSlide(index + 1); restartTimer(); });
document.querySelector('[data-slide-prev]').addEventListener('click', () => { showSlide(index - 1); restartTimer(); });
pauseButton.addEventListener('click', () => {
  paused = !paused;
  pauseButton.setAttribute('aria-pressed', String(paused));
  pauseButton.textContent = paused ? 'Play' : 'Pause';
  restartTimer();
});
hero.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') showSlide(index + 1);
  if (event.key === 'ArrowLeft') showSlide(index - 1);
});
hero.addEventListener('mouseenter', () => clearInterval(timer));
hero.addEventListener('mouseleave', restartTimer);
hero.addEventListener('focusin', () => clearInterval(timer));
hero.addEventListener('focusout', () => requestAnimationFrame(restartTimer));
document.addEventListener('visibilitychange', restartTimer);

document.querySelector('.project-filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-project-filter]');
  if (!button) return;
  document.querySelectorAll('[data-project-filter]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
  document.querySelectorAll('[data-project]').forEach((card) => { card.hidden = button.dataset.projectFilter !== 'all' && card.dataset.project !== button.dataset.projectFilter; });
});

showSlide(0, false);
restartTimer();
