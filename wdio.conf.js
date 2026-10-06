import { spawn } from 'node:child_process';

let preview;
const browserName = process.env.BROWSER === 'edge' ? 'MicrosoftEdge' : 'chrome';
const browserArgs = [
  ...(process.env.HEADLESS === '0' ? [] : ['--headless=new']),
  '--disable-gpu',
  '--window-size=1440,1050',
  '--force-color-profile=srgb'
];

export const config = {
  runner: 'local',
  specs: ['./tests/redesign.e2e.js', './tests/sector-enhancements.e2e.js', './tests/portfolio-polish.e2e.js'],
  maxInstances: 1,
  capabilities: [{
    browserName,
    ...(browserName === 'chrome' ? { 'goog:chromeOptions': { args: browserArgs } } : { 'ms:edgeOptions': { args: browserArgs } })
  }],
  logLevel: 'warn',
  bail: 0,
  baseUrl: 'http://127.0.0.1:4178',
  waitforTimeout: 8000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  framework: 'mocha',
  reporters: ['spec'],
  mochaOpts: { ui: 'bdd', timeout: 120000 },
  onPrepare: async () => {
    preview = spawn(process.execPath, ['scripts/preview-all.mjs'], { cwd: process.cwd(), stdio: 'ignore', windowsHide: true });
    for (let attempt = 0; attempt < 30; attempt += 1) {
      try { const response = await fetch('http://127.0.0.1:4178/construction/'); if (response.ok) return; } catch {}
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    throw new Error('Local preview server did not start');
  },
  onComplete: () => { if (preview && !preview.killed) preview.kill(); }
};
