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
import { create } from 'domain';
import { Subject } from '../../models/subject';
import { UserSubject } from '../../models/subject-user';
import { _ } from 'ajv';

const router = express.Router();

router.use(routeWithUserRoles([EUserRole.Admin]));

router.get(
  '/',
  wrapAsyncMiddleware(async function(req, res) {
    const users = await User.findAll({
      transaction: req.$transaction,
    });
    return await res.$json({ data: users });
  }),
);

router.post(
  '/',
  wrapAsyncMiddleware(async function(req, res) {
    renameObjectProp(req.body, 'password', 'passwordHash');
    let body;
    let onlySubjects: string[] = [];
    if(req.body.subjects) {
      const { subjects, ...rest } = req.body;
      onlySubjects = subjects || req.body.subjects;
      body = rest;
    } else {
      body= req.body;
    }

    const user = await User.create(body, {
      transaction: req.$transaction,
    }).then(async user => {
      if(user.role === EUserRole.Student && onlySubjects.length) {
        for(let i = 0; i < onlySubjects.length; i++) {
          const subject = await Subject.findByPk(onlySubjects[i] ,{
            transaction: req.$transaction,
          });
          await UserSubject.create({ subjectId: subject.id, userId: user.id } as UserSubject, {
            transaction: req.$transaction,
          })
        }
      } 

      return await User.findByPk(user.id, {
        include: [Subject],
        transaction: req.$transaction,
      });
      
    }).then((user) => {

      return res.status(201).$json({ data: user });
    })

  }),
);

router.put(
  '/:userId',
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
