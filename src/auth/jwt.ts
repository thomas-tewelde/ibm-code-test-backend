/** @module app/auth/jwt */

import * as Debug from 'debug';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as passportJwt from 'passport-jwt';

import { IUser } from '../models/user/user';

import { config } from '../config';
import { User } from '../models/user';
import { EntityNotFoundError, InvalidCredentialsError } from '../errors';

const debug = Debug('app:auth:jwt');

export interface IUserJWTPayload extends IUser {
  jwtVersion: User['jwtVersion'];
}

/**
 * Return the configured passport strategy for authenticating
 * using JWT tokens.
 *
 * The tokens are expected to be found in the HTTP headers
 * as a bearer token i.e. `Authorization: Bearer xxx`.
 */
export function getStrategy() {
  return new passportJwt.Strategy(
    {
      jwtFromRequest: passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.auth.jwt.secret,
      algorithms: [config.auth.jwt.algorithm],
      passReqToCallback: true,
    },
    authenticate,
  );
}

/**
 * Generate a JWT token for the target user.
 * @param user Target user
 */
export async function getJWT(user: User) {
  debug('generating JWT {userId=%s}', user.id);
  const payload: IUserJWTPayload = Object.assign(
    {
      jwtVersion: user.jwtVersion,
    },
    user.toJSON(),
  );
  return new Promise(function(resolve, reject) {
    const { algorithm, expiresIn, secret } = config.auth.jwt;
    return jwt.sign(
      payload,
      secret,
      {
        algorithm,
        expiresIn,
      },
      function(error, token) {
        if (error) {
          return reject(error);
        }
        return resolve(token);
      },
    );
  });
}

function authenticate(req: express.Request, payload: IUserJWTPayload, done) {
  debug(
    'authenticating user {userId=%s, jwtVersion=%d}',
    payload.id,
    payload.jwtVersion,
  );
  return User.findOne({
    where: { id: payload.id },
    transaction: req.$transaction,
  })
    .then(function(user) {
      if (!user) {
        debug('user not found {userId=%s}', payload.id);
        return done(null, false, {
          error: new EntityNotFoundError('user not found'),
        });
      }
      // NOTE/impl: If the token has a different version from
      // that set in the database, we consider it invalid (e.g. revoked).
      if (user.jwtVersion !== payload.jwtVersion) {
        debug(
          'token version mismatch {userId=%s, actual=%d, expected=%d}',
          payload.id,
          payload.jwtVersion,
          user.jwtVersion,
        );
        return done(null, false, {
          error: new InvalidCredentialsError('expired token'),
        });
      }
      return done(null, user);
    })
    .catch(done);
}
