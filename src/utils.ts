import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { resolve } from 'path';

export const INSTALL_DIRECTORY = 'sonar-scanner';
export const WINDOWS_INSTALL_PATH = `C:\\${INSTALL_DIRECTORY}`;
export const UBUNTU_INSTALL_PATH = `/home/runner/${INSTALL_DIRECTORY}`;

export function isWindows(): boolean {
  return process.platform === 'win32';
}

export function isMacOS(): boolean {
  return process.platform === 'darwin';
}

export function isUbuntu(): boolean {
  return process.platform === 'linux';
}

/**
 * Run the sonar-scanner cli. This function is required inside the action itself since core.addPath only affect further
 * steps.
 * @param args The sonar-scanner arguments.
 */
export async function sonar(args: string[]): Promise<void> {
  const bin = resolve(
    getSonarScannerDirectory(),
    'bin',
    'sonar-scanner' + (isWindows() ? '.bat' : ''),
  );
  await exec.exec(bin, args);
}

export function getDownloadLink(): string {
  const version = core.getInput('version');
  return `https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${version}.zip`;
}

export function getSonarScannerDirectory(): string {
  if (isWindows()) {
    return WINDOWS_INSTALL_PATH;
  } else if (isUbuntu()) {
    return UBUNTU_INSTALL_PATH;
  } else {
    const home = process.env.HOME ? process.env.HOME : process.cwd();
    return resolve(home, INSTALL_DIRECTORY);
  }
}
