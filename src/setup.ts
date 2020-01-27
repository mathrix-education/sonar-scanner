import { appendFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import { getSonarScannerDirectory } from './download';
import { isUbuntu } from './utils';

/**
 * Setup the Sonar Scanner CLI, including:
 * 1. Append the 'options' input to the default config file
 * 2. Unshallow git repository if necessary
 * 3. Install TypeScript if necessary
 */
export async function setup(): Promise<void> {
  core.addPath(resolve(getSonarScannerDirectory(), 'bin'));

  // Add default options
  if (core.getInput('options') !== '') {
    const defaultConfFile = resolve(getSonarScannerDirectory(), 'conf', 'sonar-scanner.properties');

    if (isUbuntu()) {
      await exec.exec(`sudo echo -n "${core.getInput('options')}" >> ${defaultConfFile}`);
    } else {
      appendFileSync(defaultConfFile, core.getInput('options'));
    }
  }

  // Unshallow the git repository if necessary
  if (core.getInput('unshallow').toLowerCase() === 'true') {
    await exec.exec('git fetch --unshallow');
  }

  // Install TypeScript if necessary
  if (core.getInput('typescript').toLowerCase() === 'true') {
    /*
     * If a package.json exists, running npm install will install all packages
     * which is not desirable. We will temperately move package.json.
     */
    if (existsSync('package.json')) {
      await io.mv('package.json', 'package.json.tmp');
    }

    await exec.exec('npm install typescript --no-package-lock --no-save');

    if (existsSync('package.json.tmp')) {
      await io.mv('package.json.tmp', 'package.json');
    }
  }
}
