import '../../shared/base.css';
import './style.css';
import './enhancements.css';
import './contrast.css';
import './motion.css';
import { initDemo, initTabs, swapMotionPanel } from '../../shared/demo-core.js';

initDemo({ name: 'Halden Legal' });

const routes = {
  commercial: { title:'Map obligations before negotiation.', copy:'Start with the agreement, the commercial outcome and the decisions that cannot move.', preparation:'The current draft, decision timeline and responsible stakeholders', expertise:'Commercial agreements and practical risk allocation', initials:'EH', person:'Elena Hart', role:'Commercial and technology' },
  technology: { title:'Separate product ambition from accountable risk.', copy:'Start with the service, the data involved and the responsibilities between each party.', preparation:'A service overview, data flow and current supplier terms', expertise:'Technology contracts, data responsibilities and product risk', initials:'EH', person:'Elena Hart', role:'Commercial and technology' },
  employment: { title:'Clarify the process before communicating change.', copy:'Start with the decision, the people affected and the evidence supporting the intended route.', preparation:'The proposed change, relevant policies and a high level timeline', expertise:'Workplace process, policy and organisational change', initials:'DM', person:'David Mensah', role:'Employment and governance' },
  disputes: { title:'Define the useful outcome before escalating.', copy:'Start with the chronology, available evidence and the commercial result worth protecting.', preparation:'A short chronology, key documents and desired resolution', expertise:'Early merits review, evidence planning and proportionate resolution', initials:'SK', person:'Samira Khan', role:'Dispute strategy' }
};

const practiceCopy = {
  commercial:['Commercial agreements','Make the obligations legible before they become problems.','Contract review, negotiation strategy, supplier relationships and practical risk allocation for growing organisations.'],
  employment:['Employment and workplace','Handle change with rigour and respect.','Policy, organisational change and workplace decisions framed around process, evidence and the people affected.'],
  technology:['Technology and data','Translate technical systems into accountable decisions.','Technology contracts, data responsibilities and product risk explained in operational language.'],
  disputes:['Dispute strategy','Choose the outcome before choosing the fight.','Early merits review, evidence planning and proportionate routes to resolution.']
};

function selectMatter(key) {
  const route = routes[key];
  document.querySelectorAll('[data-matter]').forEach((button) => button.setAttribute('aria-selected', String(button.dataset.matter === key)));
  const panel = document.querySelector('.matter-result');
  swapMotionPanel(panel, () => {
  document.querySelector('#matter-title').textContent = route.title;
  document.querySelector('#matter-copy').textContent = route.copy;
  document.querySelector('#matter-preparation').textContent = route.preparation;
  document.querySelector('#matter-expertise').textContent = route.expertise;
  document.querySelector('#matter-initials').textContent = route.initials;
  document.querySelector('#matter-person').textContent = route.person;
  document.querySelector('#matter-role').textContent = route.role;
  document.querySelector('#consult-area').value = key;
  });
}

document.querySelectorAll('[data-matter]').forEach((button) => button.addEventListener('click', () => selectMatter(button.dataset.matter)));
initTabs('.practice-tabs', (key) => { const [label,title,text] = practiceCopy[key]; const panel=document.querySelector('.practice-layout article'); swapMotionPanel(panel,()=>{document.querySelector('#practice-label').textContent=label; document.querySelector('#practice-title').textContent=title; document.querySelector('#practice-copy').textContent=text;}); });
