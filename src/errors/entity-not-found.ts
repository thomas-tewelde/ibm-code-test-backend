/** @module app/errors */

import { AppError, IAppErrorOptions } from './error';

/**
 * Error thrown when a data entity is not found.
 */
export class EntityNotFoundError extends AppError {
  constructor(message: string, options: IAppErrorOptions = {}) {
    super('ENOENTITY', message || 'data entity not found', {
      ...options,
      statusCode: 404,
    });
  }
}
