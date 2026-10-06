import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const capture = process.env.BROWSER !== 'edge';
const artifactRoot = resolve('artifacts', 'portfolio-current-2026-10-06');
const viewports = [['desktop',1440,1050],['tablet',1024,1100],['mobile',390,844]];

async function captureSite(slug, route, interactionSelector) {
  if (!capture) return;
  const output = resolve(artifactRoot, slug);
  await mkdir(output, { recursive:true });
  for (const [name,width,height] of viewports) {
    await browser.setWindowSize(width,height);
    await browser.url(route);
    await $('body').waitForDisplayed();
    await browser.saveScreenshot(resolve(output,`${slug}-${name}.png`));
    const overflow=await browser.execute(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1);
    assert.equal(overflow,false,`${slug} has horizontal overflow at ${width}px`);
  }
  if (interactionSelector) {
    await browser.setWindowSize(1440,1050);
    await browser.url(route);
    await $(interactionSelector).scrollIntoView({ block:'start' });
    await browser.saveScreenshot(resolve(output,`${slug}-interaction.png`));
  }
}

async function pageHealth() {
  assert.equal(await browser.execute(()=>document.querySelectorAll('main').length),1,'page needs one main landmark');
  const external=await browser.execute(()=>performance.getEntriesByType('resource').map((entry)=>entry.name).filter((name)=>!name.startsWith(location.origin)&&!name.startsWith('data:')));
  assert.deepEqual(external,[],'page loaded an external resource');
  const logs=await browser.getLogs('browser').catch(()=>[]);
  assert.deepEqual(logs.filter((entry)=>entry.level==='SEVERE'),[],'browser console contained severe errors');
}

describe('sector enhancement websites',()=>{
  beforeEach(async()=>{ await browser.setWindowSize(1440,1050); });
  it('runs the Metricline Decision Room deterministically',async()=>{
    await browser.url('/analytics/');
    await $('#hero-question').selectByAttribute('value','growth');
    await $('#analyse-question').click();
    await expect($('#review-title')).toHaveText('Pipeline review / October');
    await expect($('#primary-value')).toHaveText('GBP 1.8m');
    assert.equal(await $$('#driver-list .driver-row').length,3);
    await $('#evidence-button').click();
    assert.equal(await $('#evidence-panel').isDisplayed(),true);
    await $('[data-tab="delivery"]').click();
    await expect($('#review-title')).toHaveText('Delivery review / Sprint 18');
    await expect($('#movement')).toHaveText('Cycle time rose after review');
    await pageHealth();
    await captureSite('analytics','/analytics/','.decision-app');
  });

  it('operates the Halden Matter Pathfinder and safe consultation',async()=>{
    await browser.url('/legal/');
    await browser.execute(()=>document.querySelector('[data-matter="technology"]').focus());
    await browser.keys(['Enter']);
    await expect($('#matter-title')).toHaveText('Separate product ambition from accountable risk.');
    await expect($('#matter-person')).toHaveText('Elena Hart');
    await $('[data-matter="employment"]').click();
    await expect($('#matter-person')).toHaveText('David Mensah');
    assert.equal(await $('#consult-area').getValue(),'employment');
    await $('#matter-action').click();
    await $('#consult label:nth-of-type(2) select').selectByVisibleText('Within one month');
    await $('#consult button[type="submit"]').click();
    await expect($('#consult [data-form-status]')).toHaveText(expect.stringContaining('nothing was sent or stored'));
    await pageHealth();
    await captureSite('legal','/legal/','#pathfinder');
  });

  it('filters, saves, persists and compares Atria homes',async()=>{
    await browser.url('/realestate/');
    await browser.execute(()=>localStorage.removeItem('atria-demo-favourites'));
    await browser.refresh();
    const saveButtons=await $$('.save');
    await saveButtons[0].click(); await saveButtons[1].click(); await saveButtons[2].click();
    assert.equal(await $('#saved-top span').getText(),'3');
    assert.equal(await $$('#compare-grid article').length,2);
    await expect($('#compare-grid')).toHaveText(expect.stringContaining('Alder Courtyard'));
    await expect($('#compare-grid')).toHaveText(expect.stringContaining('Riverfold Loft'));
    await browser.refresh();
    await browser.waitUntil(async()=>await $('#saved-top span').getText()==='3');
    assert.equal(await $('#saved-top span').getText(),'3');
    await $('#area').selectByAttribute('value','riverside');
    await $('#beds').selectByAttribute('value','2');
    await $('#search-form button[type="submit"]').click();
    await expect($('#result-count')).toHaveText('Showing 1 fictional property');
    await $('.listings article[data-name="Tide House"] [data-property-detail]').click();
    await expect($('#detail-access')).toHaveText('Level entrance, adaptable bathroom');
    assert.equal(await browser.execute(() => [...document.querySelectorAll('#property-detail .detail dl div')].every((card) => {
      const style = getComputedStyle(card);
      return style.color === 'rgb(28, 33, 31)' && style.backgroundColor === 'rgb(241, 237, 228)';
    })), true, 'property detail cards need explicit dark text on warm light surfaces');
    await $('#property-detail .close').click();
    await pageHealth();
    await captureSite('realestate','/realestate/','#lens');
    await browser.execute(()=>localStorage.removeItem('atria-demo-favourites'));
  });

  it('routes Kindred Paws concerns and bypasses forms for emergencies',async()=>{
    await browser.url('/vet/');
    await $('[data-hero-route="concern"]').click();
    await expect($('#hero-route-title')).toHaveText('Request a prompt clinical review.');
    await $('#hero-route-action').click();
    assert.equal(await $('#visit').isDisplayed(),true);
    assert.equal(await $('#visit-need').getValue(),'concern');
    await $('#visit-animal').selectByVisibleText('Dog');
    await $('#visit-time').selectByVisibleText('Morning');
    await $('#visit button[type="submit"]').click();
    await expect($('#visit [data-form-status]')).toHaveText(expect.stringContaining('nothing was sent or stored'));
    await $('#visit [data-dialog-close]').click();
    await $('[data-hero-route="urgent"]').click();
    await expect($('#hero-route-title')).toHaveText('Contact a professional now.');
    await $('#hero-route-action').click();
    assert.equal(await $('#visit').isDisplayed(),false,'urgent route must bypass appointment dialog');
    await expect($('#urgent')).toBeDisplayed();
    await expect($('#urgent-title')).toHaveText('Emergency? Call now.');
    assert.equal((await $('.urgent-contact span').getText()).toLowerCase(), '24/7 fictional emergency vet line');
    assert.equal(await $('.urgent-contact a').getAttribute('href'), 'tel:+442079460999');
    await expect($('.urgent-contact a')).toHaveText('Call 020 7946 0999');
    await pageHealth();
    await captureSite('vet','/vet/','#navigator');
  });

  it('keeps essential content available when JavaScript is disabled',async()=>{
    await browser.sendCommand('Emulation.setScriptExecutionDisabled',{value:true});
    for (const [route,selector] of [['/analytics/','.hero-copy h1'],['/legal/','.hero h1'],['/realestate/','.hero h1'],['/vet/','.hero h1']]) {
      await browser.url(route);
      assert.equal(await $(selector).isDisplayed(),true,`${route} lost essential content without JavaScript`);
      assert.equal(await $('[data-concept-banner]').isDisplayed(),true,`${route} lost its portfolio ownership notice`);
    }
    await browser.sendCommand('Emulation.setScriptExecutionDisabled',{value:false});
  });
});
