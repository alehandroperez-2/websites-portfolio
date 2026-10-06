import assert from 'node:assert/strict';

const sites = ['dental','vet','restaurant','hotel','realestate','construction','construction-fieldbook','saas','analytics','legal','shop'];

describe('portfolio-wide interaction polish', () => {
  beforeEach(async () => { await browser.setWindowSize(1440, 1050); });

  it('adds progressive page behavior to every portfolio website', async () => {
    for (const site of sites) {
      await browser.url(`/${site}/`);
      await $('body').waitForDisplayed();
      await $('.page-progress').waitForExist({ timeout: 3000, timeoutMsg: `${site} needs the shared scroll progress` });
      await browser.waitUntil(
        async () => browser.execute(() => document.body.classList.contains('experience-ready')),
        { timeout: 3000, timeoutMsg: `${site} needs the shared entrance state` }
      );
      const severe = (await browser.getLogs('browser').catch(() => [])).filter((entry) => entry.level === 'SEVERE');
      assert.deepEqual(severe, [], `${site} emitted browser errors`);
    }
  });

  it('completes the Vela appointment wizard and covers the viewport seam', async () => {
    await browser.url('/dental/');
    assert.equal(await browser.execute(() => document.querySelector('.hero').getBoundingClientRect().bottom >= innerHeight - 1), true);
    assert.equal(await $$('.hero-proof').length, 0, 'the removed hero proof panel must not be rendered');
    await $('nav [data-dialog-open="booking"]').click();
    await $('#booking input[value="check"]').click();
    await $('[data-booking-next]').click();
    await $('#booking select[name="preferred-day"]').selectByVisibleText('Tuesday 10:30');
    await $$('#booking select')[1].selectByVisibleText('No adjustment needed');
    await $('#booking button[type="submit"]').click();
    assert.equal(await $('[data-booking-step="3"]').isDisplayed(), true);
    await expect($('[data-booking-summary]')).toHaveText(expect.stringContaining('Tuesday 10:30'));
  });

  it('runs the responsive Sora dish carousel, menu filters and reservation', async () => {
    await browser.url('/restaurant/');
    assert.equal(await browser.execute(() => document.querySelector('.hero').getBoundingClientRect().bottom >= innerHeight - 1), true);
    assert.equal(await $$('.dish-card').length, 8);
    const initialScroll = await browser.execute(() => document.querySelector('.dish-carousel__viewport').scrollLeft);
    await browser.pause(600);
    const carouselState = await browser.execute((start) => {
      const viewport = document.querySelector('.dish-carousel__viewport');
      const cards = [...document.querySelectorAll('.dish-carousel__track > *')];
      return { moved: viewport.scrollLeft > start + 2, start, current: viewport.scrollLeft, clientWidth: viewport.clientWidth, scrollWidth: viewport.scrollWidth, hidden: document.hidden, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, paused: document.querySelector('[data-dish-pause]').getAttribute('aria-pressed'), active: document.activeElement?.outerHTML?.slice(0, 120), offsets: cards.slice(0, 5).map((card) => card.offsetLeft) };
    }, initialScroll);
    assert.equal(carouselState.moved, true, `carousel must move immediately without pointer interaction: ${JSON.stringify(carouselState)}`);
    await $('[data-dish-pause]').click();
    assert.equal(await $('[data-dish-pause]').getAttribute('aria-pressed'), 'true');
    const pausedScroll = await browser.execute(() => document.querySelector('.dish-carousel__viewport').scrollLeft);
    await browser.pause(250);
    assert.equal(await browser.execute((start) => Math.abs(document.querySelector('.dish-carousel__viewport').scrollLeft - start) < 1, pausedScroll), true, 'pause must stop automatic movement');
    await $('[data-dish-next]').click();
    await browser.pause(750);
    assert.equal(await $('#dish-current').getText(), '02');
    await $('[data-dish-prev]').click();
    await browser.pause(750);
    assert.equal(await $('#dish-current').getText(), '01');
    await browser.execute(() => document.querySelector('.dish-carousel__viewport').focus());
    await browser.keys(['ArrowRight']);
    await browser.pause(750);
    assert.equal(await $('#dish-current').getText(), '02');
    await $('[data-tab="plant"]').click();
    assert.equal(await $$('.menu-list article:not([hidden])').length, 2);
    await $('nav [data-dialog-open="reserve"]').click();
    await $('#reserve select[name="guests"]').selectByVisibleText('1 to 2');
    await $('#reserve select[name="evening"]').selectByVisibleText('Thursday');
    await $('#reserve select[name="time"]').selectByVisibleText('17:45');
    await $('#reserve button[type="submit"]').click();
    await expect($('#reserve [data-form-status]')).toHaveText(expect.stringContaining('Nothing was sent or stored'));
  });

  it('validates Northlight dates, styles the guest selector and compares two rooms', async () => {
    await browser.url('/hotel/');
    const background = await $('.booking-bar select').getCSSProperty('background-color');
    assert.notEqual(background.value, 'rgba(0,0,0,0)');
    const buttons = await $$('.room-grid button');
    await buttons[0].click();
    await buttons[1].click();
    assert.equal(await $$('.compare-grid article').length, 2);
    await buttons[2].click();
    assert.equal(await $$('.compare-grid article').length, 2);
    assert.equal(await $('.room-grid article[data-room="Headland"]').getAttribute('class').then((value) => value.includes('is-selected')), true);
    const dates = await $$('.booking-bar input[type="date"]');
    await dates[0].setValue('2027-06-10');
    await dates[1].setValue('2027-06-12');
    await $('.booking-bar select').selectByVisibleText('2 guests');
    await $('.booking-bar button[type="submit"]').click();
    await expect($('.booking-bar [data-form-status]')).toHaveText(expect.stringContaining('nothing was sent or stored'));
  });

  it('operates the Northlight gallery and rejects an invalid departure date', async () => {
    await browser.url('/hotel/');
    await $('[data-gallery="fire"]').click();
    assert.equal(await $('[data-gallery="fire"]').getAttribute('aria-pressed'), 'true');
    assert.equal(await $('[data-gallery="sea"]').getAttribute('aria-pressed'), 'false');
    await expect($('.gallery-status')).toHaveText(expect.stringContaining('fire view featured'));
    await $('#arrival').setValue('2027-06-10');
    await $('#departure').setValue('2027-06-10');
    await browser.execute(() => document.querySelector('#departure').dispatchEvent(new Event('change', { bubbles: true })));
    assert.match(await $('#departure').getProperty('validationMessage'), /after arrival/i);
  });

  it('resizes, zooms and resets the Atria neighbourhood map with keyboard controls', async () => {
    await browser.url('/realestate/');
    await $('.map-resizer').scrollIntoView({ block: 'center' });
    await browser.execute(() => document.querySelector('.map-resizer').focus());
    await browser.keys(['ArrowRight']);
    assert.equal(await $('.map-resizer').getAttribute('aria-valuenow'), '53');
    await $('[data-map-zoom="in"]').click();
    assert.equal(await browser.execute(() => getComputedStyle(document.querySelector('.map-canvas')).getPropertyValue('--map-scale').trim()), '1.2');
    await $('[data-map-reset]').click();
    assert.equal(await $('.map-resizer').getAttribute('aria-valuenow'), '50');
    assert.equal(await browser.execute(() => getComputedStyle(document.querySelector('.map-canvas')).getPropertyValue('--map-scale').trim()), '1');
  });

  it('runs explicit motion, pauses ambient motion in the background and respects reduced motion', async () => {
    await browser.url('/analytics/');
    await $('#hero-question').selectByAttribute('value', 'growth');
    await $('#analyse-question').click();
    await browser.waitUntil(async () => await $('.app-content').getAttribute('class').then((value) => value.includes('analysis-complete')));
    assert.equal(await browser.execute(() => document.querySelector('.app-content').getAnimations({ subtree: true }).length > 0), true);

    await browser.url('/saas/');
    assert.equal(await $$('.hero .eyebrow').length, 0);
    assert.equal(await $$('.hero .product-float').length, 0);
    assert.equal(await browser.execute(() => document.querySelector('.hero > section').innerText.trim().replace(/\s+/g, ' ')), 'Find the signal. Move the work.');
    assert.equal(await $('html').getAttribute('data-ambient-motion'), 'running');
    assert.equal(await browser.execute(() => document.querySelector('.orb').getAnimations().some((animation) => animation.playState === 'running')), true);
    const initialOrbTransform = await $('.orb.one').getCSSProperty('transform').then((value) => value.value);
    await browser.pause(600);
    assert.notEqual(await $('.orb.one').getCSSProperty('transform').then((value) => value.value), initialOrbTransform, 'ambient light must visibly begin moving after load');
    await browser.execute(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.equal(await browser.execute(() => document.querySelector('.orb').getAnimations().every((animation) => animation.playState === 'paused')), true);
    await browser.execute(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: false });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    assert.equal(await browser.execute(() => document.querySelector('.orb').getAnimations().some((animation) => animation.playState === 'running')), true);

    await browser.sendCommand('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await browser.refresh();
    await browser.waitUntil(async () => await $('html').getAttribute('data-ambient-motion') === 'off');
    assert.equal(await $('html').getAttribute('data-ambient-motion'), 'off');
    assert.equal(await browser.execute(() => document.querySelector('.orb').getAnimations().length), 0);
    assert.equal(await $$('.reveal-pending').length, 0);
    await browser.sendCommand('Emulation.setEmulatedMedia', { features: [] });
  });

  it('uses local professional and product imagery without duplicated shop artwork', async () => {
    await browser.url('/legal/');
    assert.equal(await $$('.people img').length, 3);
    assert.equal(await browser.execute(() => [...document.querySelectorAll('.people img')].every((image) => {
      const url = new URL(image.getAttribute('src'), location.href);
      return url.origin === location.origin && url.pathname.includes('/media/');
    })), true);
    await browser.url('/shop/');
    const sources = await browser.execute(() => [...document.querySelectorAll('.product-grid img')].map((image) => image.getAttribute('src')));
    assert.equal(sources.length, 6);
    assert.equal(new Set(sources).size, 6);
    const quickShopFit = await browser.execute(() => [...document.querySelectorAll('.quick-grid picture')].map((picture) => {
      const image = picture.querySelector('img');
      const media = picture.getBoundingClientRect();
      const art = image.getBoundingClientRect();
      return { complete: image.complete, naturalWidth: image.naturalWidth, media: [media.width, media.height], art: [art.width, art.height], fit: getComputedStyle(image).objectFit };
    }));
    assert.equal(quickShopFit.every(({ complete, naturalWidth, media, art }) => complete && naturalWidth > 0 && art[0] <= media[0] && art[1] <= media[1]), true, `quick-shop artwork must fit completely inside each media frame: ${JSON.stringify(quickShopFit)}`);
    assert.equal(await browser.execute(() => document.querySelector('.campaign-slide.is-active img').getAnimations().some((animation) => animation.playState === 'running')), true, 'initial campaign image must move immediately');
  });
});
