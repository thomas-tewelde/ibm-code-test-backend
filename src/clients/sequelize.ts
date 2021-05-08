/** @module app/clients/sequelize */

import * as path from 'path';

import * as Debug from 'debug';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';

import { config } from '../config';
import { IClientExport } from './client';

const debug = Debug('app:clients:sequelize');

/**
 * Sequelize instance; PostgreSQL client.
 */
export const sequelize: IClientExport<Sequelize> = {};

/**
 * Create a Sequelize client.
 *
 * Ideally, you would invoke this function during the setup
 * phase of your components.
 *
 * The client is created only once during the application's
 * lifetime. Any subsequent invocations, after the 1st one,
 * are ignored.
 */
export async function createSequelize() {
  if (sequelize.$) {
    return;
  }
  
  debug('creating client');
  const models = path.resolve(__dirname, '../models') + '/**/*.model.*';

  
  sequelize.$ = new Sequelize(
    Object.assign(
      {
        define: {
          freezeTableName: true,
          paranoid: true,
          timestamps: true,
        },
        dialect: 'postgres',
        logging: config.database.logging ? console.log : false,
        models: [models],
        modelMatch: (filename, member) => {
          return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
        },
        pool: {
          idle: 10000,
          min: 0,
          max: 5,
        },
      } as SequelizeOptions,
      config.database.postgres,
    ),
  );
  sequelize.$.sync(
    // {force: true}
    // {alter: true}
  );
  return sequelize;
}
