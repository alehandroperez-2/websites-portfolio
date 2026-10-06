import '../../shared/base.css'; import './style.css'; import './motion.css'; import { initDemo, initTabs, swapMotionPanel } from '../../shared/demo-core.js'; initDemo({name:'Fluxlane AI'});
const tour={connect:['Connect','Bring the operating picture together.','Unify signals from delivery, incidents and customer feedback without replacing the tools teams already use.'],explain:['Explain','Make every alert traceable.','Show why a risk changed, which evidence supports it and what uncertainty remains.'],act:['Act','Turn insight into owned work.','Route the next action with a clear owner, due point and measurable definition of done.']}; initTabs('.tour-nav',key=>{const [step,title,copy]=tour[key];const panel=document.querySelector('.tour article');swapMotionPanel(panel,()=>{document.querySelector('#tour-step').textContent=step;document.querySelector('#tour-title').textContent=title;document.querySelector('#tour-copy').textContent=copy;});});
const team=document.querySelector('#team'),hours=document.querySelector('#hours');function roi(){document.querySelector('#team-out').value=team.value;document.querySelector('#hours-out').value=hours.value;document.querySelector('#roi-result').textContent=Math.round(+team.value*+hours.value*.67);}document.querySelector('#roi-form').addEventListener('input',roi);roi();

const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
let ambientAnimations=[];
function startAmbient(){
  ambientAnimations.forEach((animation)=>animation.cancel()); ambientAnimations=[];
  if(motionQuery.matches){document.documentElement.dataset.ambientMotion='off';return;}
  const paths=[[[0,0,1],[-120,70,1.2],[90,120,.88],[150,-60,1.12],[0,0,1]],[[0,0,1],[120,-90,.86],[-80,-130,1.18],[-140,60,.92],[0,0,1]]];
  document.querySelectorAll('.orb').forEach((orb,index)=>{const frames=paths[index%paths.length].map(([x,y,scale],step)=>({transform:`translate3d(${x}px,${y}px,0) scale(${scale}) rotate(${step*14-12}deg)`,opacity:[.42,.58,.46,.55,.42][step]}));const animation=orb.animate(frames,{duration:18000+index*6000,iterations:Infinity,easing:'ease-in-out'});if(document.hidden)animation.pause();ambientAnimations.push(animation);});
  document.documentElement.dataset.ambientMotion='running';
}
document.addEventListener('visibilitychange',()=>ambientAnimations.forEach((animation)=>document.hidden?animation.pause():animation.play()));
motionQuery.addEventListener?.('change',startAmbient);
startAmbient();

