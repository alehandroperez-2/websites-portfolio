import '../../shared/base.css';
import './style.css';
import './motion.css';
import { initDemo, money, swapMotionPanel } from '../../shared/demo-core.js';

initDemo({ name: 'Forge & Field Field Book' });

const range = document.querySelector('#compare-range');
const after = document.querySelector('.after-image');
function updateComparison() { after.style.clipPath = `inset(0 ${100 - range.value}% 0 0)`; }
range.addEventListener('input', updateComparison);
range.addEventListener('change', updateComparison);
updateComparison();

document.querySelector('.field-filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-field-filter]');
  if (!button) return;
  document.querySelectorAll('[data-field-filter]').forEach((item) => item.setAttribute('aria-selected', String(item === button)));
  const grid=document.querySelector('.field-cards');
  swapMotionPanel(grid,()=>document.querySelectorAll('[data-field-project]').forEach((card) => { card.hidden = button.dataset.fieldFilter !== 'all' && card.dataset.fieldProject !== button.dataset.fieldFilter; }));
});

const calculator = document.querySelector('#calculator');
const area = document.querySelector('#area');
function calculate() {
  document.querySelector('#area-output').value = area.value;
  const type = Number(document.querySelector('#type').value);
  const complexity = Number(document.querySelector('#complexity').value);
  const result = document.querySelector('#result');
  if (!type || !complexity) { result.textContent = 'Select project details'; return; }
  const midpoint = type * Number(area.value) * complexity;
  const copy = `${money(midpoint * .88)} to ${money(midpoint * 1.15)}`;
  swapMotionPanel(result.closest('.estimate-result'),()=>{result.textContent=copy;});
}
calculator.addEventListener('input', calculate);
calculate();
