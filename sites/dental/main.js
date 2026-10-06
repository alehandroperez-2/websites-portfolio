import '../../shared/base.css';
import './style.css';
import './professional.css';
import './polish.css';
import './motion.css';
import { initDemo, swapMotionPanel } from '../../shared/demo-core.js';
initDemo({ name: 'Vela Dental Studio' });

const booking = document.querySelector('#booking form');
const bookingSteps = [...booking.querySelectorAll('[data-booking-step]')];
const progress = [...booking.querySelectorAll('.booking-progress li')];
function showBookingStep(number, animate = true) {
  const render = () => {
    bookingSteps.forEach((step) => { step.hidden = step.dataset.bookingStep !== String(number); });
    progress.forEach((item, index) => index === number - 1 ? item.setAttribute('aria-current', 'step') : item.removeAttribute('aria-current'));
  };
  animate ? swapMotionPanel(booking, render) : render();
}
booking.querySelector('[data-booking-next]').addEventListener('click', () => {
  const firstRadio = booking.querySelector('input[name="visit"]');
  if (!booking.querySelector('input[name="visit"]:checked')) {
    firstRadio.setCustomValidity('Choose the type of visit to continue.');
    firstRadio.reportValidity();
    return;
  }
  firstRadio.setCustomValidity('');
  showBookingStep(2);
});
booking.querySelector('[data-booking-back]').addEventListener('click', () => showBookingStep(1));
booking.addEventListener('submit', () => {
  if (!booking.checkValidity()) return;
  const visit = booking.querySelector('input[name="visit"]:checked')?.parentElement?.textContent.trim() || 'Selected visit';
  const day = booking.querySelector('[name="preferred-day"]')?.value || 'Selected time';
  booking.querySelector('[data-booking-summary]').textContent = `${visit} · ${day}`;
  showBookingStep(3);
});
document.querySelectorAll('[data-dialog-open="booking"]').forEach((button) => button.addEventListener('click', () => {
  booking.reset();
  booking.querySelector('[data-form-status]').textContent = '';
  showBookingStep(1, false);
}));


