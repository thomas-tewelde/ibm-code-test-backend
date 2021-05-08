/** @module app/errors */

import { AppError, IAppErrorOptions } from './error';

/**
 * Error thrown when user's effective permissions
 * do NOT allow them to perform the current operation.
 */
export class ForbiddenError extends AppError {
  constructor(options: IAppErrorOptions = {}) {
    super('EFORBIDDEN', 'action forbidden', {
      ...options,
      statusCode: 403,
    });
  }
}
