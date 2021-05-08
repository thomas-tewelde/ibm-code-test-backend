/** @module app/errors */

import { AppError, IAppErrorOptions } from './error';

/**
 * Error thrown when app configurations are found to
 * be invalid.
 */
export class InvalidConfigError extends AppError {
  constructor(payload: any, options: IAppErrorOptions = {}) {
    super('EINVALIDCONFIG', 'invalid app configuration', {
      ...options,
      payload,
    });
  }
}
