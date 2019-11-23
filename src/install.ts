import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { renameSync } from 'fs';
import { resolve } from 'path';
import { getDownloadLink, getSonarScannerDirectory, sonar } from './utils';

/**
 * Install the Google Cloud SDK.
 */
export async function install(): Promise<void> {
  // Download the archive
  const downloadLink = getDownloadLink();
  const downloadPath = await tc.downloadTool(downloadLink);
  const extractionPath = resolve(getSonarScannerDirectory(), '..');
  const versionedDirectory = resolve(
    extractionPath,
    `sonar-scanner-${core.getInput('version')}`,
  );

  // Extract, normalize and register binaries
  await tc.extractZip(downloadPath, extractionPath);
  renameSync(versionedDirectory, getSonarScannerDirectory());

  core.addPath(resolve(getSonarScannerDirectory(), 'bin'));

  // Run Sonar Scanner
  if (core.getInput('scan')) {
    const args = core.getInput('args').split(' ');
    await sonar(args);
  }
}

install()
  .then(() => {
    core.info('Installation succeeded');
  })
  .catch(e => {
    core.error('Installation failed');
    core.setFailed(e.message);
  });
