import '../../shared/base.css';
import './style.css';
import './motion.css';
import { initDemo, initTabs, money } from '../../shared/demo-core.js';

initDemo({ name: 'ORRA Runway Film Store' });

const hero = document.querySelector('.runway-hero');
const slides = [...hero.querySelectorAll('[data-slide]')];
const pauseButton = document.querySelector('[data-slide-pause]');
const controls = document.querySelector('.runway-controls');
let slideIndex = 0;
let paused = matchMedia('(prefers-reduced-motion: reduce)').matches;
let timer;

if (paused) {
  pauseButton.setAttribute('aria-pressed', 'true');
  pauseButton.textContent = 'Play';
}

function showSlide(next, announce = true) {
  slideIndex = (next + slides.length) % slides.length;
  slides.forEach((slide, index) => {
    const active = index === slideIndex;
    slide.classList.toggle('is-active', active);
    slide.setAttribute('aria-hidden', String(!active));
  });
  const slide = slides[slideIndex];
  document.querySelector('#campaign-current').textContent = String(slideIndex + 1).padStart(2, '0');
  document.querySelector('#campaign-edition').textContent = slide.dataset.edition;
  const words = slide.dataset.title.split(' ');
  document.querySelector('#campaign-title').innerHTML = `${words.slice(0, -1).join(' ')} <i>${words.at(-1)}</i>`;
  document.querySelector('#campaign-description').textContent = slide.dataset.description;
  if (announce) document.querySelector('#campaign-announcement').textContent = `Showing ${slide.dataset.title}`;
}

function restartTimer() {
  clearInterval(timer);
  if (!paused && !document.hidden && !controls.matches(':focus-within')) timer = setInterval(() => showSlide(slideIndex + 1, false), 6500);
}

document.querySelector('[data-slide-next]').addEventListener('click', () => { showSlide(slideIndex + 1); restartTimer(); });
document.querySelector('[data-slide-prev]').addEventListener('click', () => { showSlide(slideIndex - 1); restartTimer(); });
pauseButton.addEventListener('click', () => { paused = !paused; pauseButton.setAttribute('aria-pressed', String(paused)); pauseButton.textContent = paused ? 'Play' : 'Pause'; restartTimer(); });
hero.addEventListener('keydown', (event) => { if (event.target !== hero) return; if (event.key === 'ArrowRight') showSlide(slideIndex + 1); if (event.key === 'ArrowLeft') showSlide(slideIndex - 1); });
controls.addEventListener('focusin', () => clearInterval(timer));
controls.addEventListener('focusout', () => requestAnimationFrame(restartTimer));
document.addEventListener('visibilitychange', restartTimer);

initTabs('.filters', (kind) => document.querySelectorAll('.product-grid [data-product]').forEach((item) => { item.hidden = kind !== 'all' && item.dataset.kind !== kind; }));

const key = 'orra-runway-demo-cart';
let cart = [];
try { cart = JSON.parse(localStorage.getItem(key) || '[]'); if (!Array.isArray(cart)) cart = []; } catch { cart = []; }

function renderCart() {
  document.querySelector('#cart-button span').textContent = cart.length;
  document.querySelector('#cart-items').innerHTML = cart.length ? cart.map((item, index) => `<article><span>${item.name} · ${item.size}</span><strong>${money(item.price)}</strong><button type="button" data-remove="${index}" aria-label="Remove ${item.name}">Remove</button></article>`).join('') : '<p>Your demo bag is empty.</p>';
  document.querySelector('#cart-total').textContent = money(cart.reduce((sum, item) => sum + item.price, 0));
  localStorage.setItem(key, JSON.stringify(cart));
}

document.body.addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const card = button.closest('[data-product]');
  const size = card.querySelector('select')?.value || 'One size';
  cart.push({ name: card.dataset.name, price: Number(card.dataset.price), size });
  renderCart();
  const original = button.textContent;
  button.textContent = 'Added';
  button.classList.add('is-added');
  setTimeout(() => { button.textContent = original; button.classList.remove('is-added'); }, 900);
});

document.querySelector('#cart-items').addEventListener('click', (event) => { const button = event.target.closest('[data-remove]'); if (!button) return; cart.splice(Number(button.dataset.remove), 1); renderCart(); });
document.querySelector('#clear-cart').addEventListener('click', () => { cart = []; renderCart(); });

showSlide(0, false);
restartTimer();
renderCart();
