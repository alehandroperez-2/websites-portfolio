import '../../shared/base.css';
import './style.css';
import './polish.css';
import './motion.css';
import { initDemo, swapMotionPanel } from '../../shared/demo-core.js';

const booking = document.querySelector('.booking-bar');
const [arrival, departure] = booking.querySelectorAll('input[type="date"]');
const guestSelect = booking.querySelector('select');

initDemo({
  name: 'Northlight House Hotel',
  onAction(action, form) {
    if (action !== 'form-complete' || form !== booking) return;
    const party = guestSelect.value;
    form.querySelector('[data-form-status]').textContent = `Demo availability prepared for ${party}. No booking was created and nothing was sent or stored.`;
    document.querySelector('#stays').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  }
});

const toDateValue = (date) => date.toISOString().slice(0, 10);
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
arrival.min = toDateValue(tomorrow);
departure.min = toDateValue(new Date(tomorrow.getTime() + 86400000));

[arrival, departure].forEach((input) => {
  input.addEventListener('click', () => input.showPicker?.());
  input.closest('label')?.addEventListener('click', (event) => {
    if (event.target === input) return;
    input.focus();
    input.showPicker?.();
  });
});

function validateDates() {
  departure.setCustomValidity('');
  if (!arrival.value) return;
  const nextDay = new Date(`${arrival.value}T12:00:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  departure.min = toDateValue(nextDay);
  if (departure.value && departure.value <= arrival.value) departure.setCustomValidity('Departure must be after arrival.');
}

arrival.addEventListener('change', validateDates);
departure.addEventListener('change', validateDates);

const roomData = {
  Drift: { size:'24 m²', view:'Sea glimpse', include:'Breakfast', rate:190 },
  Tide: { size:'38 m²', view:'Full sea view', include:'Sauna hour', rate:280 },
  Headland: { size:'52 m²', view:'Panoramic view', include:'Private terrace', rate:360 }
};
const selected = new Set();
const compare = document.querySelector('#compare');

function renderComparison() {
  const rooms = [...selected];
  swapMotionPanel(compare, () => {
    if (!rooms.length) {
      compare.innerHTML = '<strong>Room comparison</strong><span>Choose up to two rooms to compare.</span>';
      return;
    }
    compare.innerHTML = `<strong>${rooms.length === 1 ? 'Add one more room' : 'Side by side'}</strong><div class="compare-grid">${rooms.map((room) => { const data=roomData[room]; return `<article><b>${room}</b><span>${data.size}</span><span>${data.view}</span><span>${data.include}</span><em>from ${data.rate} / night</em></article>`; }).join('')}</div>`;
  });
}

document.querySelectorAll('.room-grid button').forEach((button) => button.addEventListener('click', () => {
  const article = button.closest('article');
  const room = article.dataset.room;
  if (selected.has(room)) selected.delete(room);
  else if (selected.size < 2) selected.add(room);
  else {
    const first = selected.values().next().value;
    selected.delete(first);
    selected.add(room);
  }
  document.querySelectorAll('.room-grid article').forEach((card) => {
    const active = selected.has(card.dataset.room);
    card.classList.toggle('is-selected', active);
    const control = card.querySelector('button');
    control.textContent = active ? 'Remove' : 'Compare';
    control.setAttribute('aria-pressed', String(active));
  });
  renderComparison();
}));

document.querySelectorAll('[data-gallery]').forEach((button) => button.addEventListener('click', () => {
  const gallery = button.closest('.gallery');
  gallery.querySelectorAll('[data-gallery]').forEach((item) => {
    const selectedItem = item === button;
    item.classList.toggle('is-featured', selectedItem);
    item.setAttribute('aria-pressed', String(selectedItem));
  });
  gallery.querySelector('.gallery-status').textContent = `${button.dataset.gallery} view featured.`;
}));

const cinematic = document.querySelector('.cinematic');
document.addEventListener('visibilitychange', () => { cinematic.style.animationPlayState = document.hidden ? 'paused' : 'running'; });

renderComparison();
