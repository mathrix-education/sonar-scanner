import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import { renameSync } from 'fs';
import { resolve } from 'path';
import { getDownloadLink, getSonarScannerDirectory } from './utils';

/**
 * Install the Google Cloud SDK.
 */
export async function install(): Promise<void> {
  try {
    const downloadLink = getDownloadLink();
    const downloadPath = await tc.downloadTool(downloadLink);
    const extractionPath = resolve(getSonarScannerDirectory(), '..');

    renameSync(`sonar-scanner-${core.getInput('version')}`, 'sonar-scanner');

    await tc.extractZip(downloadPath, extractionPath);

    const binPath = resolve(getSonarScannerDirectory(), 'bin');
    core.addPath(binPath);
  } catch (e) {
    core.setFailed(e.message);
  }
}

install()
  .then(() => {
    core.info('Installation succeeded');
  })
  .catch(() => {
    core.error('Installation failed');
  });
