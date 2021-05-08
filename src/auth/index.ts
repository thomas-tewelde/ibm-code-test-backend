/** @module app/auth */

import * as passport from 'passport';

import { getStrategy as getJWTStrategy } from './jwt';

export async function setup() {
  passport.use('jwt', getJWTStrategy());
}
