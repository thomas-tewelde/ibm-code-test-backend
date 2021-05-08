/** @module app */

import { IConfig } from './index.d';

const config = {} as IConfig;
const env = process.env;

// Modes
config.app = {
  devMode: !env.NODE_ENV || env.NODE_ENV === 'development',
};

// Auth
config.auth = {
  jwt: {
    secret: env.JWT_SECRET || 'test-jwt-secret',
    algorithm: 'HS256',
    expiresIn: '7d',
  },
  password: {
    saltRounds: 10,
  },
};

// Database
config.database = {
  logging: !env.NO_DB_LOGGING && !!env.DEBUG,
  postgres: {
    host: env.POSTGRES_HOST || env.PGHOST || '127.0.0.1',
    port: parseInt(env.POSTGRES_PORT || env.PGPORT, 10) || 5432,
    username: env.POSTGRES_USERNAME || env.PGUSER || 'postgres',
    password: env.POSTGRES_PASSWORD || env.PGPASSWORD || 'postgres',
    database: env.POSTGRES_DB || env.PGDATABASE || 'develop',
  },
};

// HTTP server
config.http = {
  host: env.HTTP_HOST || '127.0.0.1',
  port: parseInt(env.HTTP_PORT, 10) || 3000,
  cors: {
    origins: env.HTTP_CORS_ORIGINS
      ? env.HTTP_CORS_ORIGINS.split(',')
      : ['http://localhost:4200', 'http://localhost:8081'],
  },
};

// Application modes
config.modes = {
  dev: !env.NODE_ENV || env.NODE_ENV === 'development',
};

// API routes configurations
config.routes = {
  transactionPerRequest: true,
};

export = config;
