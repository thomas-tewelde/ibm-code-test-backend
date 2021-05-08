/** @module app/errors */

import { AppError, IAppErrorOptions } from './error';

/**
 * Error thrown when user's credentials are invalid
 * e.g. incorrect password.
 */
export class InvalidCredentialsError extends AppError {
  constructor(message?: string, options: IAppErrorOptions = {}) {
    super('EINVALIDCREDS', message || 'invalid credentials', {
      ...options,
      statusCode: 401,
    });
  }
}
