import '../../shared/base.css';
import './style.css';
import './professional.css';
import './enhancements.css';
import './motion.css';
import './urgent.css';
import { initDemo, initTabs, swapMotionPanel } from '../../shared/demo-core.js';

initDemo({ name: 'Kindred Paws Veterinary Clinic' });

const routes = {
  routine: { title:'Plan a wellness appointment.', copy:'Suitable for checks, vaccinations, prevention and ongoing care.', prep:'Bring current medication and previous clinic details.', availability:'Fictional availability: appointments this week', action:'Plan routine care' },
  concern: { title:'Request a prompt clinical review.', copy:'A new or changing concern should be assessed by a veterinary professional.', prep:'Note when the change began and any current medication.', availability:'Fictional availability: same day requests reviewed', action:'Explore a same day request' },
  urgent: { title:'Contact a professional now.', copy:'This demo cannot triage an emergency. Use an appropriate local emergency veterinary provider.', prep:'Keep the animal safe and follow direct professional instructions.', availability:'Emergency route: no online appointment simulation', action:'Read emergency guidance' }
};

const action = document.querySelector('#hero-route-action');
function selectRoute(key, animate = true) {
  const route = routes[key];
  document.querySelectorAll('[data-hero-route]').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.heroRoute === key)));
  const panel = document.querySelector('.route-result');
  const render = () => {
  document.querySelector('#hero-route-title').textContent=route.title; document.querySelector('#hero-route-copy').textContent=route.copy; document.querySelector('#hero-route-prep span').textContent=route.prep; document.querySelector('#hero-route-availability').textContent=route.availability; action.textContent=route.action;
  if (key === 'urgent') { action.removeAttribute('data-dialog-open'); action.onclick = () => document.querySelector('#urgent').scrollIntoView(); }
  else { action.dataset.dialogOpen='visit'; action.onclick = () => { document.querySelector('#visit-need').value=key; }; }
  };
  if (animate && key !== 'urgent') swapMotionPanel(panel, render); else render();
}
document.querySelectorAll('[data-hero-route]').forEach((button) => button.addEventListener('click', () => selectRoute(button.dataset.heroRoute)));

const care = { well:['Prevention with a purpose','Health checks, vaccinations, parasite planning and nutrition advice shaped around lifestyle, not a generic schedule.'], new:['A calm first look','A structured visit for a new change, with room for observation, questions and clear next steps.'], age:['Comfort through every chapter','Mobility, dental health, screening and quality of life conversations for older companions.'] };
initTabs('.chips',(key)=>{ const [title,text]=care[key]; const panel=document.querySelector('#care-copy'); swapMotionPanel(panel,()=>{document.querySelector('#care-copy div').innerHTML=`<h3>${title}</h3><p>${text}</p>`;}); });

const visitForm=document.querySelector('#visit form'), needSelect=document.querySelector('#visit-need'), finderResult=document.querySelector('[data-finder-result]');
document.querySelectorAll('[data-visit-choice]').forEach((button)=>button.addEventListener('click',()=>{needSelect.value=button.dataset.visitChoice;}));
visitForm.addEventListener('submit',()=>{ if(!visitForm.checkValidity()) return; const results={routine:['Routine appointment','A standard planned appointment is the closest simulated route. A real clinic would confirm suitability and timing.'],concern:['Prompt clinical review','A same day request is the closest simulated route. If the animal worsens, contact a local veterinary professional directly.'],senior:['Senior wellbeing appointment','A longer planned visit can make room for mobility, comfort, medication and quality of life questions.']}; const [title,copy]=results[needSelect.value]; finderResult.innerHTML=`<strong>${title}</strong><p>${copy}</p>`; finderResult.hidden=false; });
document.querySelectorAll('[data-dialog-open="visit"]').forEach((button)=>button.addEventListener('click',()=>{finderResult.hidden=true;}));
selectRoute('routine', false);
