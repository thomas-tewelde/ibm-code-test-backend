/** @module app/config */

import { Algorithm } from "jsonwebtoken";

/** Application configuration. */
export interface IConfig {
  /** Application mode configurations. */
  app: {
    devMode: boolean;
  };
  /** Authentication/authorization configurations. */
  auth: {
    /** JWT configurations. */
    jwt: {
      secret: string;
      algorithm: Algorithm;
      expiresIn: string;
    };
    /** Password configurations. */
    password: {
      saltRounds: number;
    };
  };

  /** Database configurations. */
  database: {
    /** Enable logging of db ops. */
    logging: boolean;
    /**
     * Postgres Environment variables are listed at
     * https://www.postgresql.org/docs/current/static/libpq-envars.html.
     */
    postgres: {
      host: string;
      port: number;
      username: string;
      password: string;
      database: string;
    };
  };

  /** HTTP server configurations. */
  http: {
    host: string;
    port: number;
    /** CORS configurations */
    cors: {
      /** Allowed/valid origins. */
      origins: string[];
    };
  };

  /** Application modes. */
  modes: {
    /** Are we in development mode? */
    dev: boolean;
  };

  /** API routes configurations. */
  routes: {
    /** Is transaction-per-request feature enabled? */
    transactionPerRequest: boolean;
  };
}
