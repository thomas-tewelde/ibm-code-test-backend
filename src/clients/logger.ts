/** @module app/clients/logger */

import * as Debug from 'debug';
import { Logger, createLogger as create, format, transports } from 'winston';

import { config } from '../config';
import { IClientExport } from './client';

const debug = Debug('app:clients:logger');

/**
 * Winston logger instance.
 */
export const logger: IClientExport<Logger> = {};

/**
 * Create a logger.
 */
export async function createLogger() {
  if (logger.$) {
    return;
  }
  debug('creating client');
  const formats = [format.timestamp()];
  if (config.modes.dev) {
    const devFormat = format(info => {
      const description = [
        `[${info.timestamp}]`,
        info.level.toUpperCase(),
        info.message,
      ].join(' ');
      info.message = info[Symbol.for('message') as any] = [
        description,
        info.error ? info.error.stack : null,
        info.originalError ? info.originalError.stack : null,
      ]
        .filter(Boolean)
        .join('\n');
      return info;
    });
    formats.push(devFormat());
  } else {
    formats.push(format.json());
  }
  logger.$ = create({
    level: 'info',
    format: format.combine(...formats),
    transports: [new transports.Console()],
  });
}
