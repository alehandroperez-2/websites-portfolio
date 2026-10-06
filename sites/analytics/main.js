import '../../shared/base.css';
import './style.css';
import './enhancements.css';
import './motion.css';
import { initDemo, swapMotionPanel } from '../../shared/demo-core.js';

initDemo({ name: 'Metricline Analytics' });

const analyses = {
  retention: {
    review: 'Retention review / September', primaryLabel: 'Net retention', primaryValue: '91.4%', primaryChange: 'Down 3.8 points',
    riskLabel: 'At risk revenue', riskValue: 'GBP 184k', riskNote: '24 accounts', confidence: '87%', confidenceNote: '6 sources aligned', explained: 'EXPLAINED 78%',
    chartTitle: 'Retention and expected range', line: 'M0 62 C70 48 96 65 145 58 S235 80 285 84 S365 104 410 130 S500 125 560 150', area: 'M0 62 C70 48 96 65 145 58 S235 80 285 84 S365 104 410 130 S500 125 560 150 L560 205 L0 205Z', point: [410, 130],
    drivers: [['Delayed onboarding', '42%'], ['Lower feature adoption', '23%'], ['Support response time', '13%']], next: 'Which onboarding stage predicts churn?',
    decision: 'Review the two onboarding stages with the sharpest adoption drop in seven days.',
    evidence: 'Illustrative evidence: onboarding completion, feature adoption and support response data agree on the same enterprise cohort.',
    metricLabel: 'Accounts needing review', metricValue: '24', metricNote: '7 are high value renewals', movement: 'Retention fell after week two', driver: 'Onboarding completion is the strongest ranked contributor.', modelNote: 'Confidence is high because six fictional sources point in the same direction.'
  },
  growth: {
    review: 'Pipeline review / October', primaryLabel: 'Qualified pipeline', primaryValue: 'GBP 1.8m', primaryChange: 'Up 12.6%',
    riskLabel: 'Unconverted demand', riskValue: 'GBP 310k', riskNote: '18 opportunities', confidence: '81%', confidenceNote: '5 sources aligned', explained: 'EXPLAINED 73%',
    chartTitle: 'Qualified pipeline and forecast band', line: 'M0 162 C72 155 105 148 150 130 S235 122 290 96 S365 92 425 66 S510 54 560 38', area: 'M0 162 C72 155 105 148 150 130 S235 122 290 96 S365 92 425 66 S510 54 560 38 L560 205 L0 205Z', point: [425, 66],
    drivers: [['Partner referrals', '34%'], ['Enterprise content', '25%'], ['Faster qualification', '14%']], next: 'Which referral source creates the best conversion?',
    decision: 'Protect the partner channel and inspect the 18 stalled opportunities.',
    evidence: 'Illustrative evidence: source attribution, stage velocity and opportunity quality support the same growth pattern.',
    metricLabel: 'Qualified opportunities', metricValue: '46', metricNote: '18 require a next action', movement: 'Pipeline grew for three weeks', driver: 'Partner referrals explain the largest share of the lift.', modelNote: 'Confidence is strong, with one unresolved attribution gap.'
  },
  delivery: {
    review: 'Delivery review / Sprint 18', primaryLabel: 'Cycle time', primaryValue: '9.6 days', primaryChange: 'Up 2.1 days',
    riskLabel: 'Work at risk', riskValue: '17 items', riskNote: '5 customer facing', confidence: '76%', confidenceNote: '4 sources aligned', explained: 'EXPLAINED 69%',
    chartTitle: 'Cycle time and expected range', line: 'M0 148 C70 140 102 145 148 124 S240 118 290 100 S370 70 425 78 S505 56 560 48', area: 'M0 148 C70 140 102 145 148 124 S240 118 290 100 S370 70 425 78 S505 56 560 48 L560 205 L0 205Z', point: [425, 78],
    drivers: [['Review queue', '31%'], ['Environment waits', '22%'], ['Scope changes', '16%']], next: 'Which review queue causes the longest wait?',
    decision: 'Cap review work and assign one owner to environment waits.',
    evidence: 'Illustrative evidence: workflow events, environment availability and scope changes explain most of the cycle time movement.',
    metricLabel: 'Items beyond target', metricValue: '17', metricNote: '5 affect customer journeys', movement: 'Cycle time rose after review', driver: 'Review queues are the strongest ranked contributor.', modelNote: 'Confidence is moderate because two fictional workflow fields are incomplete.'
  }
};

const $ = (selector) => document.querySelector(selector);

function renderDrivers(items) {
  $('#driver-list').replaceChildren(...items.map(([label, value], index) => {
    const row = document.createElement('div');
    row.className = 'driver-row';
    row.innerHTML = `<span>${index + 1}</span><b>${label}</b><strong>${value}</strong>`;
    return row;
  }));
}

function applyAnalysis(key, announce = true) {
  const data = analyses[key];
  const panel = $('.app-content');
  const render = () => {
  $('#hero-question').value = key;
  const fields = { '#review-title':data.review, '#primary-label':data.primaryLabel, '#primary-value':data.primaryValue, '#primary-change':data.primaryChange, '#risk-label':data.riskLabel, '#risk-value':data.riskValue, '#risk-note':data.riskNote, '#confidence-value':data.confidence, '#confidence-note':data.confidenceNote, '#explained-value':data.explained, '#chart-title':data.chartTitle, '#next-question':data.next, '#decision-copy':data.decision, '#evidence-copy':data.evidence, '#metric-label':data.metricLabel, '#metric-value':data.metricValue, '#metric-note':data.metricNote, '#movement':data.movement, '#driver':data.driver, '#model-note':data.modelNote };
  Object.entries(fields).forEach(([selector, value]) => { $(selector).textContent = value; });
  $('#chart-line').setAttribute('d', data.line); $('#chart-area').setAttribute('d', data.area); $('#chart-point').setAttribute('cx', data.point[0]); $('#chart-point').setAttribute('cy', data.point[1]);
  renderDrivers(data.drivers);
  document.querySelectorAll('[data-tab]').forEach((button) => { const selected = button.dataset.tab === key; button.classList.toggle('active', selected); button.setAttribute('aria-selected', String(selected)); });
  panel.classList.remove('analysis-complete');
  requestAnimationFrame(() => panel.classList.add('analysis-complete'));
  if (announce) $('#question-status').textContent = `${data.review} is now shown with illustrative local data.`;
  };
  announce ? swapMotionPanel(panel, render) : render();
}

$('#analyse-question').addEventListener('click', () => applyAnalysis($('#hero-question').value));
document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => applyAnalysis(button.dataset.tab)));
$('#evidence-button').addEventListener('click', () => { const panel = $('#evidence-panel'); panel.hidden = !panel.hidden; $('#evidence-button').setAttribute('aria-expanded', String(!panel.hidden)); $('#evidence-button').textContent = panel.hidden ? 'Open evidence' : 'Close evidence'; });
applyAnalysis('retention', false);
