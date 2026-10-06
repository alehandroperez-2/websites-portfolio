import { spawnSync } from 'node:child_process';

const sites = ['dental','vet','restaurant','hotel','realestate','construction','construction-fieldbook','saas','analytics','legal','shop'];
const npmCli = process.env.npm_execpath;
for (const site of sites) {
  console.log(`\nBuilding ${site}...`);
  const command = npmCli ? process.execPath : 'npm';
  const args = npmCli
    ? [npmCli, '--workspace', `@showcase/${site}`, 'run', 'build']
    : ['--workspace', `@showcase/${site}`, 'run', 'build'];
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  if (result.status !== 0) process.exit(result.status ?? 1);
}

