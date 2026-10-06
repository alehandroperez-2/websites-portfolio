import '../../shared/base.css';
import './style.css';
import './polish.css';
import './motion.css';
import { initDemo, initTabs, swapMotionPanel } from '../../shared/demo-core.js';

initDemo({
  name: 'Sora Table Restaurant',
  onAction(action, form) {
    if (action !== 'form-complete' || !form.matches('#reserve form')) return;
    const data = new FormData(form);
    form.querySelector('[data-form-status]').textContent = `Demo complete for ${data.get('guests')} on ${data.get('evening')} at ${data.get('time')}. Nothing was sent or stored.`;
  }
});

initTabs('.filters', (kind) => {
  const list = document.querySelector('.menu-list');
  swapMotionPanel(list, () => {
    let visible = 0;
    document.querySelectorAll('.menu-list article').forEach((item) => {
      item.hidden = kind !== 'all' && item.dataset.kind !== kind;
      if (!item.hidden) visible += 1;
    });
    document.querySelector('#dish-status').textContent = `${visible} menu items shown.`;
  });
});

const viewport = document.querySelector('.dish-carousel__viewport');
const track = document.querySelector('.dish-carousel__track');
const pauseButton = document.querySelector('[data-dish-pause]');
const originalCards = [...track.querySelectorAll('[data-dish-card]')];
originalCards.forEach((card) => {
  const duplicate = card.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.tabIndex = -1;
  duplicate.removeAttribute('data-dish-card');
  track.append(duplicate);
});

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
let userPaused = reducedMotion;
let keyboardPaused = false;
let previousTime = 0;
let controlPauseUntil = 0;
let autoPosition = 0;

function measurements() {
  const first = originalCards[0];
  const second = originalCards[1];
  const firstDuplicate = track.children[originalCards.length];
  return {
    step: second.offsetLeft - first.offsetLeft,
    cycle: firstDuplicate.offsetLeft - first.offsetLeft
  };
}

function normalizedPosition() {
  const { cycle } = measurements();
  if (!cycle) return 0;
  return ((viewport.scrollLeft % cycle) + cycle) % cycle;
}

function currentIndex() {
  const { step } = measurements();
  return step ? Math.round(normalizedPosition() / step) % originalCards.length : 0;
}

function updateCounter(index = currentIndex()) {
  document.querySelector('#dish-current').textContent = String(index + 1).padStart(2, '0');
}

function setPauseButton() {
  pauseButton.setAttribute('aria-pressed', String(userPaused));
  pauseButton.textContent = userPaused ? 'Play' : 'Pause';
}

function animate(time) {
  const { cycle } = measurements();
  if (previousTime && !userPaused && !keyboardPaused && !document.hidden && time >= controlPauseUntil && cycle) {
    autoPosition += Math.min(40, time - previousTime) * .014;
    if (autoPosition >= cycle) autoPosition -= cycle;
    viewport.scrollLeft = autoPosition;
  }
  previousTime = time;
  requestAnimationFrame(animate);
}

function scrollDishes(direction) {
  const { step, cycle } = measurements();
  if (!step || !cycle) return;
  const index = currentIndex();
  let target;
  let nextIndex;
  if (direction > 0) {
    nextIndex = (index + 1) % originalCards.length;
    target = nextIndex === 0 ? cycle : (index + 1) * step;
  } else {
    nextIndex = (index - 1 + originalCards.length) % originalCards.length;
    if (index === 0) viewport.scrollLeft = cycle;
    target = index === 0 ? cycle - step : (index - 1) * step;
  }
  controlPauseUntil = performance.now() + (reducedMotion ? 80 : 700);
  autoPosition = ((target % cycle) + cycle) % cycle;
  viewport.scrollTo({ left: target, behavior: reducedMotion ? 'auto' : 'smooth' });
  updateCounter(nextIndex);
  if (direction > 0 && nextIndex === 0) {
    setTimeout(() => { if (viewport.scrollLeft >= cycle - 2) viewport.scrollLeft -= cycle; autoPosition = 0; }, reducedMotion ? 0 : 650);
  }
}

pauseButton.addEventListener('click', () => { userPaused = !userPaused; setPauseButton(); });
document.querySelector('[data-dish-prev]').addEventListener('click', () => scrollDishes(-1));
document.querySelector('[data-dish-next]').addEventListener('click', () => scrollDishes(1));
viewport.addEventListener('focusin', () => { keyboardPaused = true; });
viewport.addEventListener('focusout', () => { keyboardPaused = false; });
viewport.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    scrollDishes(event.key === 'ArrowRight' ? 1 : -1);
  }
});
viewport.addEventListener('scroll', () => {
  if (performance.now() >= controlPauseUntil) updateCounter();
}, { passive: true });
document.addEventListener('visibilitychange', () => { previousTime = 0; });

track.addEventListener('click', (event) => {
  const card = event.target.closest('[data-target]');
  if (!card || card.getAttribute('aria-hidden') === 'true') return;
  const item = document.getElementById(card.dataset.target);
  item.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
  item.classList.add('is-highlighted');
  setTimeout(() => item.classList.remove('is-highlighted'), 1600);
  document.querySelector('#dish-status').textContent = `${item.querySelector('h3').textContent} highlighted in tonight's menu.`;
});

setPauseButton();
updateCounter(0);
requestAnimationFrame(animate);
