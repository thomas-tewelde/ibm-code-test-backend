/** @module app/errors */

import { AppError, IAppErrorOptions } from './error';

/**
 * Error thrown when the route is not found.
 */
export class RouteNotFoundError extends AppError {
  constructor(route: string, options: IAppErrorOptions = {}) {
    super('ENOROUTE', `route not found (${route})`, {
      ...options,
      statusCode: 404,
    });
  }
}
