/** @module app/config */

import Ajv from "ajv"
import * as originalConfig from 'config';

import { InvalidConfigError } from '../errors';
import { IConfig } from './index.d';

/**
 * Application's configuration.
 */
export const config: IConfig = originalConfig as any;

/**
 * Throws error `InvalidConfigError` if the configuration is invalid.
 * @param cfg Configuration to validate against
 */
export function validateConfig(cfg: IConfig) {
  const schema = require('../../schemas/config');
  const ajv = new Ajv();
  const valid = ajv.validate(schema, cfg);
  if (!valid) {
    throw new InvalidConfigError(ajv.errors);
  }
}

/**
 * Set up configuration module.
 *
 * This will validate the app config throwing an
 * error if there's misconfiguration.
 */
export async function setup() {
  // NOTE/impl: We are using a try-catch block below since
  // our logging facility is NOT yet ready to handle any
  // error at the moment. The logger expects to find the
  // configuration ready for use.
  try {
    validateConfig(config);
  } catch (error) {
    console.error(error.stack);
    console.error(error.payload);
    process.exit(1);
  }
}
