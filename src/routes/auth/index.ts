import * as express from 'express';

import { validateRouteInput, wrapAsyncMiddleware } from '../../utils';
import { getJWT } from '../../auth/jwt';
import { User } from '../../models/user';
import { InvalidCredentialsError } from '../../errors';

const router = express.Router();

router.post(
  '/jwt',
  validateRouteInput('auth/generate-token'),
  wrapAsyncMiddleware(async function(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      transaction: req.$transaction,
    });
    if (!user) {
      throw new InvalidCredentialsError();
    }
    const isPasswordCorrect = await user.checkPassword(password);
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError();
    }
    const token = await getJWT(user);
    return await res.status(201).$json({
      data: { token },
    });
  }),
);

export { router };
