import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import { resolve } from 'path';
import { version } from 'punycode';
import { MACOS_INSTALL_PATH, UBUNTU_INSTALL_PATH, WINDOWS_INSTALL_PATH } from './constants';
import { isMacOS, isUbuntu, isWindows } from './utils';

/**
 * Get the Sonar Scanner CLI download link.
 * The link depends of the requested version and if the installation requires the JRE.
 */
export function getDownloadLink(): string {
  const version = core.getInput('version');
  const withJre = core.getInput('with-jre').toLowerCase() === 'true';
  const base = 'https://binaries.sonarsource.com/Distribution/sonar-scanner-cli';
  let suffix = '';

  if (withJre) {
    if (isUbuntu()) {
      suffix += '-linux';
    } else if (isMacOS()) {
      suffix += '-macosx';
    } else if (isWindows()) {
      suffix += '-windows';
    }
  }

  return `${base}/sonar-scanner-cli-${version}${suffix}.zip`;
}

/**
 * Get the Sonar Scanner installation directory.
 */
export function getSonarScannerDirectory(): string {
  if (isUbuntu()) {
    return UBUNTU_INSTALL_PATH;
  } else if (isMacOS()) {
    return MACOS_INSTALL_PATH;
  } else {
    return WINDOWS_INSTALL_PATH;
  }
}

/**
 * Download the Sonar Scanner CLI archive.
 */
export async function download(): Promise<void> {
  const downloadLink = getDownloadLink();
  const downloadPath = await tc.downloadTool(downloadLink);
  const extractionPath = resolve(getSonarScannerDirectory(), '..');

  if (!downloadLink.endsWith('.zip')) {
    // Should never be reached
    core.setFailed(`Unexpected extension (expected zip), but got ${downloadLink}`);
  }

  if (isUbuntu()) {
    // Ubuntu: Remove the existing installation of Google Cloud SDK
    await exec.exec(`sudo rm -rf ${UBUNTU_INSTALL_PATH}`);
    await exec.exec(`sudo unzip ${downloadPath} -d ${extractionPath}`);
  } else {
    // Windows and MacOS: simply extract zip file
    await tc.extractZip(downloadPath, extractionPath);
  }

  await io.mv(`${extractionPath}/sonar-scanner-${core.getInput('version')}`, getSonarScannerDirectory());
}
