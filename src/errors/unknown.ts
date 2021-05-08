/** @module app/errors */

import { AppError, IAppErrorOptions } from './error';

/**
 * Error thrown when an unexpected error occurs.
 */
export class UnknownError extends AppError {
  constructor(options: IAppErrorOptions = {}) {
    super('EUNKNOWN', 'unexpected error occurred', options);
  }
}
