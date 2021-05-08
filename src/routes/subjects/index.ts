import * as express from 'express';

import { EUserRole } from '../../models/user';

import {
  routeWithUserRoles,
  validateRouteInput,
  wrapAsyncMiddleware,
} from '../../utils';
import { EntityNotFoundError } from '../../errors';
import Subject from '../../models/subject/subject.model';

const router = express.Router();

router.use(routeWithUserRoles([EUserRole.Staff, EUserRole.Admin]));


router.get(
  '/',
  validateRouteInput('subjects/read-subjects'),
  wrapAsyncMiddleware(async function(req, res) {
    const users = await Subject.findAll({
      transaction: req.$transaction,
    });
    return await res.$json({ data: users });
  }),
);


router.post(
  '/',
  validateRouteInput('subjects/create-subject'),
  wrapAsyncMiddleware(async function(req, res) {
    const user = await Subject.create(req.body, {
      transaction: req.$transaction,
    });

    return await res.status(201).$json({ data: user });
  }),
);


router.put(
  '/:subjectId',
  validateRouteInput('subjects/update-subject'),
  wrapAsyncMiddleware(async function(req, res) {
    const user = await Subject.findByPk(req.params.userId, {
      transaction: req.$transaction,
    });
    if (!user) {
      throw new EntityNotFoundError('subject not found');
    }
    await user.update(req.body, {
      transaction: req.$transaction,
    });
    return await res.$json({ data: user });
  }),
);


router.delete(
  '/:subjectId',
  validateRouteInput('subjects/delete-subject'),
  wrapAsyncMiddleware(async function(req, res) {
    const user = await Subject.findByPk(req.params.userId, {
      transaction: req.$transaction,
    });
    if (!user) {
      throw new EntityNotFoundError('subject not found');
    }
    await user.destroy({
      transaction: req.$transaction,
    });
    return await res.$json({ data: user });
  }),
);

export { router };
