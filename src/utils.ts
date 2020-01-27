import * as exec from '@actions/exec';
import { resolve } from 'path';
import { getSonarScannerDirectory } from './download';

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
  const bin = resolve(getSonarScannerDirectory(), 'bin', 'sonar-scanner' + (isWindows() ? '.bat' : ''));
  await exec.exec(bin, args);
}
