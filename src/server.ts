/** @module app */

import * as Debug from 'debug';
import { resolve } from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: resolve(__dirname, '../.env') });

import { setup as setupAuth } from './auth';
import { createLogger, logger } from './clients';
import { setup as setupConfig } from './config';
import { setup as setupData } from './data';
import { getErrorJSON } from './errors';
import { setup as setupRouter } from './routes';

const debug = Debug('app:main');

async function init() {
  debug('bootstrapping server');
  await setupConfig();
  await setupLogging();
  await setupData();
  await setupAuth();
  await setupRouter();
}

async function setupLogging() {
  await createLogger();
  ['uncaughtException', 'unhandledRejection'].forEach(function(errorName: any) {
    process.on(errorName, function(error: any) {
      logger.$.error('uncaught exception', {
        error: getErrorJSON(error),
        tag: errorName,
      });
      process.exit(1);
    });
  });
}

/**
 * Application's main entry point.
 */
async function main() {
  await init();
}

if (require.main === module) {
  main();
}
