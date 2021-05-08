/** @module app/errors */

import { AppError, IAppErrorOptions } from './error';

/**
 * Error thrown when a route input schema is not found.
 */
export class InputSchemaNotFoundError extends AppError {
  constructor(schemaPath: string, options: IAppErrorOptions = {}) {
    super('ENOINPUTSCHEMA', `input schema not found (${schemaPath})`, {
      ...options,
      payload: { schemaPath },
    });
  }
}
