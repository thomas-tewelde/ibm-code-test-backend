/** @module app/routes */

import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as Debug from 'debug';
import * as express from 'express';
import * as morgan from 'morgan';
import * as passport from 'passport';

import { createLogger, logger } from '../clients';
import { config } from '../config';
import {
  AppError,
  RouteNotFoundError,
  UnknownError,
  transformError,
} from '../errors';
import { getTransactionMiddlewares } from './transaction';
import { router as authRouter } from './auth';
import { router as usersRouter } from './users';
import { router as SubjectsRouter } from './subjects';

const debug = Debug('app:routes:main');

export async function setup() {
  await createLogger();

  const app = express();
  setupMiddlewares(app);
  setupRoutes(app);
  await listen(app);
}

function setupMiddlewares(app: express.Application) {
  app.options('*', cors());
  app.use(
    cors({
      origin: config.http.cors.origins,
    } as cors.CorsOptions),
  );
  // TODO: Throw error if content-type is not set!
  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(passport.initialize());

  app.use('/ping', function(_, res) {
    res.send('pong');
  });
}

function setupRoutes(app: express.Application) {
  const router = express.Router();
  
  router.use('/auth', authRouter);
  router.use(function(req, res, next) {
    passport.authenticate('jwt', { session: false }, function(
      error,
      user,
      info,
    ) {
      if (error) {
        return next(error);
      }
      if (!user) {
        let error2;
        if (info instanceof Error) {
          error2 = transformError(info);
        } else if (info && info.error) {
          error2 = info.error;
        } else {
          error2 = new UnknownError({ original: info });
        }
        return next(error2);
      }
      req.user = user;
      return next();
    })(req, res, next);
  });
  router.use('/users', usersRouter);
  router.use('/subjects', SubjectsRouter);

  const transactionMiddlewares = getTransactionMiddlewares();
  app.use(
    '/api/v1',
    transactionMiddlewares.pre,
    router,
    transactionMiddlewares.post,
  );

  app.use(function(req, res, next) {
    return next(new RouteNotFoundError(req.path));
  });
  app.use(function(e: Error | AppError, req, res, next) {
    const error = e instanceof AppError ? e : transformError(e);
    logger.$.error(`request error`, {
      error,
      originalError: error.getOriginalJSON(),
      tag: 'router.requestError',
    });
    return res.status(error.statusCode).json({ error });
  });
}

async function listen(app: express.Application) {
  debug('binding app to listening port');
  const { host, port } = config.http;
  return new Promise(function(resolve) {
    app.listen(port, host, function() {
      logger.$.info(`listening on http://${host}:${port}`, {
        host,
        port,
        tag: 'router.listening',
      });
      resolve(logger);
    });
  });
}
