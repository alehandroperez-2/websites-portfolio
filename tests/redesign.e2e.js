import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';

const capture = process.env.BROWSER !== 'edge';
const artifactRoot = resolve('artifacts', 'portfolio-current-2026-10-06');
const viewports = [
  ['desktop', 1440, 1050],
  ['tablet', 1024, 1100],
  ['mobile', 390, 844]
];

async function screenshotSet(slug, route) {
  if (!capture) return;
  const output = resolve(artifactRoot, slug);
  await mkdir(output, { recursive: true });
  for (const [name, width, height] of viewports) {
    await browser.setWindowSize(width, height);
    await browser.url(route);
    await $('body').waitForDisplayed();
    await browser.saveScreenshot(resolve(output, `${slug}-${name}.png`));
    const overflow = await browser.execute(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    assert.equal(overflow, false, `${slug} has horizontal overflow at ${width}px`);
  }
}

async function assertPageHealth() {
  assert.equal(await browser.execute(() => document.querySelectorAll('main').length === 1), true, 'page needs one main landmark');
  assert.equal(await browser.execute(() => document.querySelectorAll('a[href],button:not([disabled]),input,select,textarea').length > 0), true, 'page needs keyboard-focusable controls');
  const logs = await browser.getLogs('browser').catch(() => []);
  const severe = logs.filter((entry) => entry.level === 'SEVERE');
  assert.deepEqual(severe, [], `browser console contained errors: ${JSON.stringify(severe)}`);
}

describe('portfolio redesigns', () => {
  it('operates the Forge & Field Command Center', async () => {
    await browser.url('/construction/');
    assert.match(await browser.getTitle(), /Command Center/);
    const initial = await $('#status-title').getText();
    await browser.execute(() => document.querySelector('[data-slide-next]').focus());
    await browser.keys(['Enter']);
    await browser.waitUntil(async () => (await $('#status-title').getText()) !== initial);
    await $('[data-slide-pause]').click();
    assert.equal(await $('[data-slide-pause]').getAttribute('aria-pressed'), 'true');
    await $('[data-project-filter="civic"]').click();
    assert.equal(await $$('[data-project]:not([hidden])').length, 1);
    await $('.site-nav [data-dialog-open="brief-dialog"]').click();
    await $('#brief-dialog select').selectByVisibleText('Civic');
    await $('#brief-dialog input').setValue('4500');
    await $('#brief-dialog textarea').setValue('Programme certainty');
    await $('#brief-dialog button[type="submit"]').click();
    await expect($('#brief-dialog [data-form-status]')).toHaveText(expect.stringContaining('nothing was sent or stored'));
    await assertPageHealth();
    await screenshotSet('construction-command', '/construction/');
  });

  it('operates the Forge & Field Field Book', async () => {
    await browser.url('/construction-fieldbook/');
    assert.match(await browser.getTitle(), /Field Book/);
    await browser.execute(() => document.querySelector('[data-field-filter="reuse"]').focus());
    await browser.keys(['Enter']);
    await browser.waitUntil(async () => (await $$('[data-field-project]:not([hidden])')).length === 1);
    await browser.execute(() => {
      const control = document.querySelector('#compare-range');
      control.value = '80';
      control.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await browser.waitUntil(async () => /20%/.test(await $('.after-image').getCSSProperty('clip-path').then((value) => value.value)));
    await $('#type').selectByVisibleText('Adaptive reuse');
    await $('#complexity').selectByVisibleText('Detailed');
    await $('#area').setValue('5000');
    await browser.waitUntil(async () => await $('#result').getText() !== 'Select project details');
    await $('#calculator button[type="submit"]').click();
    await expect($('#calculator [data-form-status]')).toHaveText(expect.stringContaining('nothing was sent or stored'));
    await assertPageHealth();
    await screenshotSet('construction-fieldbook', '/construction-fieldbook/');
  });

  it('operates the ORRA Runway Film Store', async () => {
    await browser.url('/shop/');
    await browser.execute(() => localStorage.removeItem('orra-runway-demo-cart'));
    await browser.refresh();
    assert.match(await browser.getTitle(), /Runway Film Store/);
    assert.equal(await browser.execute(() => document.querySelector('.campaign-slide.is-active img').getAnimations().some((animation) => animation.playState === 'running')), true);
    const initial = await $('#campaign-title').getText();
    await browser.execute(() => document.querySelector('[data-slide-next]').focus());
    await browser.keys(['Enter']);
    await browser.waitUntil(async () => (await $('#campaign-title').getText()) !== initial);
    await $('[data-slide-pause]').click();
    await $('.quick-grid article:first-child .quick-add').click();
    assert.equal(await $('#cart-button span').getText(), '1');
    await $('#cart-button').click();
    await expect($('#cart-items')).toHaveText(expect.stringContaining('Drift Jacket'));
    await $('#cart-items [data-remove="0"]').click();
    assert.equal(await $('#cart-button span').getText(), '0');
    await $('[data-dialog-close]').click();
    await $('.product-grid [data-name="Drift Jacket"] select').selectByVisibleText('L');
    await $('.product-grid [data-name="Drift Jacket"] [data-add]').click();
    await $('#cart-button').click();
    await expect($('#cart-items')).toHaveText(expect.stringContaining('Drift Jacket · L'));
    await $('[data-dialog-close]').click();
    await $('[data-tab="object"]').click();
    assert.equal(await $$('.product-grid [data-product]:not([hidden])').length, 1);
    await browser.refresh();
    assert.equal(await $('#cart-button span').getText(), '1');
    assert.equal(await $('.checkout').isEnabled(), false);
    await $('#cart-button').click();
    await $('#clear-cart').click();
    assert.equal(await $('#cart-button span').getText(), '0');
    await $('[data-dialog-close]').click();
    await assertPageHealth();
    await screenshotSet('shop-runway', '/shop/');
  });

  it('disables automatic motion when reduced motion is requested', async () => {
    await browser.sendCommand('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await browser.url('/construction/');
    assert.equal(await $('[data-slide-pause]').getAttribute('aria-pressed'), 'true');
    await browser.url('/shop/');
    assert.equal(await $('[data-slide-pause]').getAttribute('aria-pressed'), 'true');
    assert.equal(await browser.execute(() => document.querySelector('.campaign-slide.is-active img').getAnimations().length), 0);
    await browser.sendCommand('Emulation.setEmulatedMedia', { features: [] });
  });
});
