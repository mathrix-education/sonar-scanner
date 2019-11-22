import * as core from '@actions/core';
import * as exec from '@actions/exec';
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

    await tc.extractZip(downloadPath, extractionPath);

    const versionedDirectory = resolve(
      getSonarScannerDirectory(),
      '..',
      `sonar-scanner-${core.getInput('version')}`,
    );

    renameSync(versionedDirectory, getSonarScannerDirectory());

    const binPath = resolve(getSonarScannerDirectory(), 'bin');
    core.addPath(binPath);

    await exec.exec('sonar-scanner --debug --version');
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
