/** @module app/errors */

import { AppError } from './error';
import { InvalidCredentialsError } from './invalid-credentials';
import { InvalidInputError } from './invalid-input';
import { UnknownError } from './unknown';

/**
 * Transform an 'unknown' error into a proper `AppError`
 * object.
 * @param error Any arbitrary error object
 */
export function transformError(error: any): AppError {
  // NOTE/impl: Passport passes basic/simple error if the token
  // is not found.
  if (error.message === 'No auth token') {
    return new InvalidCredentialsError('missing token', {
      original: error,
    });
  }

  // NOTE/impl: Handle expired tokens.
  if (error.name === 'TokenExpiredError') {
    return new InvalidCredentialsError('expired token', {
      original: error,
    });
  }

  // NOTE/impl: Handle JSON schema validation errors.
  if (error.name === 'JsonSchemaValidationError') {
    return new InvalidInputError(error.validationErrors, {
      original: error,
    });
  }

  // NOTE/impl: Handle Sequelize error when a validation fails or
  // a unique constraint is violated.
  const isSequelizeErrorType1 =
    ['SequelizeValidationError', 'SequelizeUniqueConstraintError'].indexOf(
      error.name,
    ) !== -1;
  if (isSequelizeErrorType1) {
    const messages = (error.errors || []).map(e => e.message);
    return new InvalidInputError(messages, {
      original: error,
    });
  }

  // NOTE/impl: Handle Sequelize error when a foreign-key constraint
  // is violated.
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    // Example: 'Key (frontCoverFileId)=(695fc506-a785-4771-b0ea-5cedcaa41f48) is not present in table "files".'
    const info = error.parent && error.parent.detail;
    const match = /\((.+)\)=\(.+\) is not present/.exec(info);
    if (match) {
      const message = `'${match[1]}' references a non-existent entity`;
      return new InvalidInputError([message], {
        original: error,
      });
    }
  }

  // NOTE/impl: If we have not been able to transform
  // the error, we should transform into an opaque
  // error. This avoids leaking error information to users.
  return new UnknownError({ original: error });
}
