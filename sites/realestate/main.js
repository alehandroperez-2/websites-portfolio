import '../../shared/base.css';
import './style.css';
import './enhancements.css';
import './motion.css';
import './detail-contrast.css';
import { initDemo, swapMotionPanel } from '../../shared/demo-core.js';

initDemo({ name: 'Atria Estates' });

const storageKey = 'atria-demo-favourites';
const cards = [...document.querySelectorAll('.listings article')];
let saved;
try { saved = new Set(JSON.parse(localStorage.getItem(storageKey) || '[]')); } catch { saved = new Set(); }

const neighbourhoods = {
  garden: ['Garden quarter', 'Leafy streets, local markets and a calmer evening rhythm, with the centre still within easy reach.'],
  central: ['Central', 'Fast connections, cultural venues and daily convenience, balanced against a more active street rhythm.'],
  riverside: ['Riverside', 'Long waterside routes, weekend activity and open views, with fictional flood context to verify.']
};

function cardByName(name) { return cards.find((card) => card.dataset.name === name); }
function comparisonCard(card) { const article = document.createElement('article'); article.innerHTML = `<small>${neighbourhoods[card.dataset.area][0]}</small><strong>${card.dataset.name}</strong><span>${card.dataset.beds} beds &middot; ${card.dataset.size}</span><dl><div><dt>Costs</dt><dd>${card.dataset.costs}</dd></div><div><dt>Access</dt><dd>${card.dataset.access}</dd></div></dl>`; return article; }

function renderSaved() {
  document.querySelector('#saved-top span').textContent = saved.size;
  document.querySelector('#compare-count').textContent = `${saved.size} saved`;
  document.querySelectorAll('.save').forEach((button) => { const name = button.closest('article').dataset.name; const active = saved.has(name); button.innerHTML = active ? '&#9829;' : '&#9825;'; button.setAttribute('aria-pressed', String(active)); });
  const grid = document.querySelector('#compare-grid');
  const selected = [...saved].map(cardByName).filter(Boolean).slice(0, 2);
  swapMotionPanel(grid, () => {
    grid.replaceChildren(...selected.map(comparisonCard));
    if (!selected.length) { const empty = document.createElement('p'); empty.className='empty'; empty.textContent='Save two properties to compare their space, costs, access and neighbourhood context.'; grid.append(empty); }
    else if (selected.length === 1) { const empty = document.createElement('p'); empty.className='empty'; empty.textContent='Save one more property to complete the comparison.'; grid.append(empty); }
  });
}

document.querySelectorAll('.save').forEach((button) => button.addEventListener('click', () => { const name=button.closest('article').dataset.name; saved.has(name) ? saved.delete(name) : saved.add(name); localStorage.setItem(storageKey, JSON.stringify([...saved])); renderSaved(); }));
document.querySelector('#saved-top').addEventListener('click', () => document.querySelector('#lens').scrollIntoView());
document.querySelectorAll('[data-map-area]').forEach((button) => button.addEventListener('click', () => { const [name, copy]=neighbourhoods[button.dataset.mapArea]; const panel=document.querySelector('.map-copy'); swapMotionPanel(panel,()=>{document.querySelector('#neighbourhood-name').textContent=name; document.querySelector('#neighbourhood-copy').textContent=copy; document.querySelectorAll('[data-map-area]').forEach((pin)=>pin.classList.toggle('active',pin===button));}); }));

document.querySelector('#search-form').addEventListener('submit', (event) => { event.preventDefault(); const area=document.querySelector('#area').value,beds=+document.querySelector('#beds').value,budget=+document.querySelector('#budget').value; let count=0; cards.forEach((card)=>{ const show=(area==='all'||card.dataset.area===area)&&+card.dataset.beds>=beds&&+card.dataset.price<=budget; card.hidden=!show; if(show) count++; }); document.querySelector('#result-count').textContent=`Showing ${count} fictional ${count===1?'property':'properties'}`; document.querySelector('#filter-status').textContent=`Filters updated. ${count} fictional properties shown.`; document.querySelector('#no-results').hidden=count!==0; document.querySelector('#listings').scrollIntoView(); });

document.querySelectorAll('[data-property-detail]').forEach((button) => button.addEventListener('click', () => { const card=button.closest('article'); document.querySelector('#detail-area').textContent=neighbourhoods[card.dataset.area][0]; document.querySelector('#detail-title').textContent=card.dataset.name; document.querySelector('#detail-summary').textContent=`${card.dataset.beds} bedrooms, ${card.dataset.size}, fictional asking price ${card.querySelector('strong').textContent}.`; document.querySelector('#detail-costs').textContent=card.dataset.costs; document.querySelector('#detail-access').textContent=card.dataset.access; document.querySelector('#detail-lifestyle').textContent=card.dataset.lifestyle; document.querySelector('#property-detail').showModal(); }));

const board=document.querySelector('.lens-board'),resizer=document.querySelector('.map-resizer'),mapCanvas=document.querySelector('.map-canvas');
let split=50,scale=1,panX=0,panY=0,dragStart;
function setSplit(value){split=Math.max(35,Math.min(70,value));board.style.setProperty('--map-share',`${split}%`);resizer.setAttribute('aria-valuenow',String(Math.round(split)));}
function setMapTransform(){mapCanvas.style.setProperty('--map-scale',String(scale));mapCanvas.style.setProperty('--map-x',`${panX}px`);mapCanvas.style.setProperty('--map-y',`${panY}px`);}
function resizeFromPointer(event){const rect=board.getBoundingClientRect();setSplit((event.clientX-rect.left)/rect.width*100);}
resizer.addEventListener('pointerdown',(event)=>{resizer.setPointerCapture(event.pointerId);resizeFromPointer(event);});
resizer.addEventListener('pointermove',(event)=>{if(resizer.hasPointerCapture(event.pointerId))resizeFromPointer(event);});
resizer.addEventListener('keydown',(event)=>{if(event.key==='ArrowLeft'){event.preventDefault();setSplit(split-3);}if(event.key==='ArrowRight'){event.preventDefault();setSplit(split+3);}if(event.key==='Home'){event.preventDefault();setSplit(35);}if(event.key==='End'){event.preventDefault();setSplit(70);}});
document.querySelectorAll('[data-map-zoom]').forEach((button)=>button.addEventListener('click',()=>{scale=Math.max(1,Math.min(1.6,scale+(button.dataset.mapZoom==='in' ? 0.2 : -0.2)));if(scale===1){panX=0;panY=0;}setMapTransform();}));
document.querySelector('[data-map-reset]').addEventListener('click',()=>{scale=1;panX=0;panY=0;setSplit(50);setMapTransform();});
mapCanvas.addEventListener('pointerdown',(event)=>{if(scale===1)return;dragStart={x:event.clientX-panX,y:event.clientY-panY};mapCanvas.setPointerCapture(event.pointerId);});
mapCanvas.addEventListener('pointermove',(event)=>{if(!dragStart||!mapCanvas.hasPointerCapture(event.pointerId))return;panX=Math.max(-80,Math.min(80,event.clientX-dragStart.x));panY=Math.max(-60,Math.min(60,event.clientY-dragStart.y));setMapTransform();});
mapCanvas.addEventListener('pointerup',(event)=>{dragStart=undefined;mapCanvas.releasePointerCapture(event.pointerId);});
setSplit(50);setMapTransform();renderSaved();
