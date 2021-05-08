/** @module app/utils */

import * as path from 'path';
import { RequestHandler } from 'express';
import { Validator } from 'express-json-validator-middleware';

import { EUserRole } from '../models/user';

import { User } from '../models/user';
import { ForbiddenError, InputSchemaNotFoundError } from '../errors';

const validator = new Validator({allErrors: true});

/**
 * Return an express middleware that validate's the route's
 * input against a provided schema.
 * Relative paths are resolved using base path
 * `./schemas/inputs` (from root of repo directory).
 * @param schemaPath Path to JSON schema file
 */
export function validateRouteInput(schemaPath): RequestHandler {
  const filepath = path.resolve(__dirname, '../../schemas/inputs', schemaPath);
  let schema;
  try {
    schema = require(filepath);
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      // NOTE/security: Ensure you do NOT pass back the `filepath`
      // instead of the schema path. Otherwise, it leaks info about
      // app code.
      throw new InputSchemaNotFoundError(schemaPath);
    }
    throw error;
  }
  return validator.validate(schema);
}

/**
 * Wrap an async function returning a proper middleware (request
 * handler) that can be passed to express.
 *
 * The wrapper can handle correctly errors thrown inside
 * the async function.
 * @param middleware Target middleware
 */
export function wrapAsyncMiddleware(
  middleware: RequestHandler
): RequestHandler {
  return function(req, res, next) {
    (middleware(req, res, null) as any)
      .then(() => {
        if (!res.headersSent) {
          next();
        }
      })
      .catch(next);
  };
}

/**
 * Return an express middleware that allows users with the specified
 * roles through.
 * @param userRoles Allowed user roles
 */
export function routeWithUserRoles(userRoles: EUserRole[]) {
  return wrapAsyncMiddleware(async function(req) {
    const user = req.user as User;
    const isAllowed = userRoles.indexOf(user.role) !== -1;
    if (!isAllowed) {
      throw new ForbiddenError();
    }
  });
}
