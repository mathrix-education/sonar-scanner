import * as core from '@actions/core';
import { download } from './download';
import { setup } from './setup';
import { sonar } from './utils';

/**
 * Install the Sonar Scanner CLI.
 */
export async function main(): Promise<void> {
  await download();
  await setup();

  // Run Sonar Scanner
  if (core.getInput('scan').toLowerCase() === 'true') {
    const args = core.getInput('args').split(' ');
    await sonar(args);
  }
}

main()
  .then(() => {
    core.info('Installation succeeded');
  })
  .catch(e => {
    core.error('Installation failed');
    core.setFailed(e.message);
  });
