import * as express from 'express';

import { EUserRole, User } from '../../models/user';

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
  wrapAsyncMiddleware(async function(req, res) {
    const subject = await Subject.findAll({
      transaction: req.$transaction,
    })
    return await res.$json({ data: subject });
  }),
);

router.get(
  '/students',
  wrapAsyncMiddleware(async function(req, res) {
    const subjects = await Subject.findAll({
      transaction: req.$transaction,
      include: [{
        model: User,
      }],
    });
    return await res.$json({ data: subjects.map(s =>( { ...s.toJSON(), ...{user: s.users}})) });
  }),
);

router.use(routeWithUserRoles([EUserRole.Admin]));
router.post(
  '/',
  validateRouteInput('subjects/create-subject'),
  wrapAsyncMiddleware(async function(req, res) {
    const subject = await Subject.create(req.body, {
      transaction: req.$transaction,
    });

    return await res.status(201).$json({ data: subject });
  }),
);


router.put(
  '/:subjectId',
  validateRouteInput('subjects/update-subject'),
  wrapAsyncMiddleware(async function(req, res) {
    const subject = await Subject.findByPk(req.params.subjectId, {
      transaction: req.$transaction,
    });
    if (!subject) {
      throw new EntityNotFoundError('subject not found');
    }
    await subject.update(req.body, {
      transaction: req.$transaction,
    });
    return await res.$json({ data: subject });
  }),
);


router.delete(
  '/:subjectId',
  validateRouteInput('subjects/delete-subject'),
  wrapAsyncMiddleware(async function(req, res) {
    const subject = await Subject.findByPk(req.params.subjectId, {
      transaction: req.$transaction,
    });
    if (!subject) {
      throw new EntityNotFoundError('subject not found');
    }
    await subject.destroy({
      transaction: req.$transaction,
    });
    return await res.$json({ data: subject });
  }),
);

export { router };
