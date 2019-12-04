import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import { appendFileSync, renameSync } from 'fs';
import { resolve } from 'path';
import { getDownloadLink, getSonarScannerDirectory, sonar } from './utils';

/**
 * Install Sonar Scanner
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

  // Add default options
  if (core.getInput('options').length > 0) {
    appendFileSync(
      resolve(getSonarScannerDirectory(), 'conf', 'sonar-scanner.properties'),
      core.getInput('options'),
    );
  }

  // Install TypeScript if necessary
  if (core.getInput('unshallow').toLowerCase() === 'true') {
    await exec.exec('git fetch --unshallow');
  }

  // Install TypeScript if necessary
  if (core.getInput('typescript').toLowerCase() === 'true') {
    await exec.exec('npm install typescript --no-package-lock --no-save');
  }

  // Run Sonar Scanner
  if (core.getInput('scan').toLowerCase() === 'true') {
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
