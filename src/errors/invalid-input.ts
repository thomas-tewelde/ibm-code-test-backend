/** @module app/errors */

import { AppError, IAppErrorOptions } from './error';

/**
 * Error thrown when input parameters were invalid.
 *
 * This includes invalid query and body parameters.
 */
export class InvalidInputError extends AppError {
  constructor(payload: any, options: IAppErrorOptions = {}) {
    super('EINVALIDINPUT', 'invalid input parameters', {
      ...options,
      payload,
      statusCode: 406,
    });
  }
}
