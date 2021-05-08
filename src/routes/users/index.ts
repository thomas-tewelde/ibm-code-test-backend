import * as express from 'express';

import { EUserRole } from '../../models/user';

import {
  renameObjectProp,
  routeWithUserRoles,
  validateRouteInput,
  wrapAsyncMiddleware,
} from '../../utils';
import { User } from '../../models/user';
import { EntityNotFoundError } from '../../errors';

const router = express.Router();

router.use(routeWithUserRoles([EUserRole.Admin]));

router.get(
  '/',
  validateRouteInput('users/read-users'),
  wrapAsyncMiddleware(async function(req, res) {
    const users = await User.findAll({
      transaction: req.$transaction,
    });
    return await res.$json({ data: users });
  }),
);

router.post(
  '/',
  validateRouteInput('users/create-user'),
  wrapAsyncMiddleware(async function(req, res) {
    renameObjectProp(req.body, 'password', 'passwordHash');
    const user = await User.create(req.body, {
      transaction: req.$transaction,
    });

    return await res.status(201).$json({ data: user });
  }),
);

router.put(
  '/:userId',
  validateRouteInput('users/update-user'),
  wrapAsyncMiddleware(async function(req, res) {
    const user = await User.findByPk(req.params.userId, {
      transaction: req.$transaction,
    });
    if (!user) {
      throw new EntityNotFoundError('user not found');
    }
    renameObjectProp(req.body, 'password', 'passwordHash');
    await user.update(req.body, {
      transaction: req.$transaction,
    });
    return await res.$json({ data: user });
  }),
);


router.delete(
  '/:userId',
  validateRouteInput('users/delete-user'),
  wrapAsyncMiddleware(async function(req, res) {
    const user = await User.findByPk(req.params.userId, {
      transaction: req.$transaction,
    });
    if (!user) {
      throw new EntityNotFoundError('user not found');
    }
    await user.destroy({
      transaction: req.$transaction,
    });
    return await res.$json({ data: user });
  }),
);

export { router };
