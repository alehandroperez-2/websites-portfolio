import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const root = resolve('artifacts', 'portfolio-current-2026-10-06');
const viewports = [['desktop',1440,1050],['tablet',1024,1100],['mobile',390,844]];
const sites = [
  ['dental','/dental/'],
  ['vet','/vet/'],
  ['restaurant','/restaurant/'],
  ['hotel','/hotel/'],
  ['realestate','/realestate/'],
  ['construction-command','/construction/'],
  ['construction-fieldbook','/construction-fieldbook/'],
  ['saas','/saas/'],
  ['analytics','/analytics/'],
  ['legal','/legal/'],
  ['shop-runway','/shop/']
];
const interactionViews = { dental:'.practice-strip', restaurant:'.dish-carousel', hotel:'.booking-bar', vet:'#urgent', realestate:'#property-detail', saas:'.hero', analytics:'.decision-app', legal:'#pathfinder', 'shop-runway':'.runway-hero' };

async function prepareInteraction(slug) {
  if (slug === 'restaurant' || slug === 'saas' || slug === 'shop-runway') await browser.pause(800);
  if (slug === 'vet') {
    await $('[data-hero-route="urgent"]').click();
    await $('#hero-route-action').click();
  }
  if (slug === 'realestate') await $('.listings article[data-name="Studio Twelve"] [data-property-detail]').click();
}

async function waitForSettledExperience() {
  await browser.waitUntil(
    async () => browser.execute(() => document.body.classList.contains('experience-ready')),
    { timeout: 3000, timeoutMsg: 'shared portfolio experience did not initialize' }
  );
  await browser.pause(950);
}

describe('current eleven-site portfolio artifacts',()=>{
  for (const [slug,route] of sites) {
    it(`captures ${slug} without layout or console errors`,async()=>{
      const output=resolve(root,slug);
      await mkdir(output,{recursive:true});
      for (const [label,width,height] of viewports) {
        await browser.setWindowSize(width,height);
        await browser.url(route);
        await $('body').waitForDisplayed();
        await waitForSettledExperience();
        assert.equal(await browser.execute(()=>document.querySelectorAll('main').length),1,`${slug} needs one main landmark`);
        assert.equal(await browser.execute(()=>document.documentElement.scrollWidth>document.documentElement.clientWidth+1),false,`${slug} overflows at ${width}px`);
        await browser.saveScreenshot(resolve(output,`${slug}-${label}.png`));
      }
      if (interactionViews[slug]) {
        await browser.setWindowSize(1440,1050);
        await browser.url(route);
        await waitForSettledExperience();
        await prepareInteraction(slug);
        await $(interactionViews[slug]).scrollIntoView({block:'start'});
        await browser.pause(450);
        await browser.saveScreenshot(resolve(output,`${slug}-interaction.png`));
      }
      const logs=await browser.getLogs('browser').catch(()=>[]);
      assert.deepEqual(logs.filter((entry)=>entry.level==='SEVERE'),[],`${slug} logged a severe browser error`);
    });
  }
});
