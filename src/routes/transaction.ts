/** @module app/routes/transaction */

import * as Debug from 'debug';
import * as express from 'express';
import * as Sequelize from 'sequelize';

import { sequelize } from '../clients';
import { config } from '../config';

const debug = Debug('app:routes:transaction');

declare global {
  namespace Express {
    interface Request {
      /** Current DB transaction for the request. */
      $transaction: Transaction;
    }
    interface Response {
      /**
       * Transaction-aware variant of `Response#json()`.
       */
      $json: (...args: any[]) => Promise<any>;
      /**
       * Transaction-aware variant of `Response#send()`.
       */
      $send: (...args: any[]) => Promise<any>;
      /**
       * Perform clean-up on response.
       *
       * Do NOT invoke this method; the relevant middleware will invoke
       * it for you.
       */
      $cleanup: Function;
    }
  }
}

/**
 * An object resembling a promise.
 *
 * This allows us to support ORMs using different promise libraries
 * other than the native promises e.g. bluebird.
 */
interface PromiseLike<A> {
  then: (handler: () => A) => PromiseLike<A>;
  catch: (handler: () => A) => PromiseLike<A>;
}

/** A generic DB transaction. */
interface ITransaction {
  /** Commit the transaction. */
  commit: () => PromiseLike<any>;
  /** Rollback the transaction. */
  rollback: () => PromiseLike<any>;
}

/**
 * Middlewares handling request transactions.
 */
export interface ITransactionMiddlewares {
  /**
   * Pre middleware that should be inserted in the middleware
   * chain BEFORE other middlewares handling requests.
   */
  pre: express.RequestHandler;
  /**
   * Post middleware that should be inserted in the middleware
   * chain AFTER other middlewares handling requests.
   */
  post: Array<express.RequestHandler | express.ErrorRequestHandler>;
}

/**
 * Return pre- and post- middlewares for handling transactions for
 * requests.
 */
export function getTransactionMiddlewares(): ITransactionMiddlewares {
  /**
   * Return a function that once invoked would exit the application
   * with an error due to a bug introduced by the developer/programmer.
   * This is used to ensure certain request/response methods are NOT used.
   * @param methodName Name of method
   */
  function getFailureTrigger(methodName: string) {
    return function() {
      console.error(
        `Programming error: ${methodName}() MUST NOT be invoked when handling request.`,
      );
      process.exit(1);
    };
  }

  // NOTE/impl: Middleware to be inserted BEFORE the actual request
  // handlers. It's responsible for creating a transaction for each
  // request.
  const pre = function(req, res, next) {
    const json: express.Send = res.json;
    const send: express.Send = res.send;
    const removeResOverrides = function() {
      delete res.$json;
      res.json = json;
      delete res.$send;
      res.send = send;
    };

    res.json = getFailureTrigger('res.json') as any;
    res.send = getFailureTrigger('res.send') as any;

    if (!config.routes.transactionPerRequest) {
      const wrap = function(method: express.Send) {
        return async function(...args) {
          res.$cleanup();
          return method.call(res, ...args);
        };
      };
      // Override response-sending functions.
      res.$json = wrap(json);
      res.$send = wrap(send);
      // Cleanup
      res.$cleanup = function() {
        removeResOverrides();
      };
      return next();
    }

    getTransaction()
      .then(function(transaction) {
        const wrap = function(method: express.Send) {
          return async function(...args) {
            await transaction.commit();
            res.$cleanup();
            return method.call(res, ...args);
          };
        };
        // Transaction
        req.$transaction = transaction;
        // Override response-sending functions.
        res.$json = wrap(json);
        res.$send = wrap(send);
        // Cleanup
        res.$cleanup = function() {
          removeResOverrides();
        };
        next();
      })
      .catch(function(createTransactionError) {
        debug('creation of request transaction failed');
        next(createTransactionError);
      });
  } as express.RequestHandler;

  // NOTE/impl: Function handling transaction commit/rollback
  // and clean-up on BOTH success and error cases.
  const post = function(error, req, res, next) {
    res.$cleanup();

    if (!config.routes.transactionPerRequest) {
      return next(error);
    }

    req.$transaction
      .rollback()
      .then(function() {
        debug('request transaction rollbacked');
        next(error);
      })
      .catch(function() {
        // NOTE/impl: If rollbacking the transaction fails, do NOT
        // worry much. Since it is not committed, it SHOULD eventually
        // time out and fail.
        debug('rollback of request transaction failed');
        next(error);
      });
  };

  // NOTE/impl: Middleware to be inserted AFTER the actual request
  // handlers. It's responsible for cleaning up on unused resources
  // if the transaction is not used e.g. API endpoint miss (404).
  const postOk = function(req, res, next) {
    post(null, req, res, next);
  } as express.RequestHandler;

  // NOTE/impl: Middleware to be inserted AFTER the actual request
  // handlers. It's responsible for rolling back the transaction on
  // request failure.
  const postError = function(error, req, res, next) {
    post(error, req, res, next);
  } as express.ErrorRequestHandler;

  return {
    pre,
    post: [postOk, postError],
  };
}

/** DB transaction from the ORM. */
type Transaction = ITransaction & Sequelize.Transaction;

/** Create and return a DB transaction from the ORM. */
async function getTransaction(): Promise<Transaction> {
  return sequelize.$.transaction();
}
