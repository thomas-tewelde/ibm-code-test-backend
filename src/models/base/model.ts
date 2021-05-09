/** @module app/models/base */

import * as Debug from 'debug';
import {
  BeforeBulkCreate,
  BeforeBulkDestroy,
  BeforeBulkRestore,
  BeforeBulkUpdate,
  BeforeCreate,
  BeforeDestroy,
  BeforeFind,
  BeforeRestore,
  BeforeUpdate,
  BeforeUpsert,
  Column,
  DataType,
  IsUUID,
  Model as BaseModel,
  PrimaryKey,
} from 'sequelize-typescript';

import { config } from '../../config';

const debug = Debug('app:data:base');

export class Model<T extends Model<T>> extends BaseModel<T> {
  /** User's unique identifier. */
  @PrimaryKey
  @IsUUID(4)
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  /**
   * Hook executed, before any DB operation is performed, to
   * ensure that the operation is tied to a transaction.
   */
  @BeforeBulkDestroy
  @BeforeBulkRestore
  @BeforeBulkUpdate
  @BeforeFind
  static async ensureTransaction(options: any) {
    if (!config.routes.transactionPerRequest) {
      return;
    }
    debug('hook: BaseModel#ensureTransaction');
    if (!options.transaction) {
      throw new Error('Request transaction missing');
    }
  }
  @BeforeBulkCreate
  @BeforeCreate
  @BeforeDestroy
  @BeforeRestore
  @BeforeUpdate
  @BeforeUpsert
  static async ensureTransaction2(_: any, options: any) {
    this.ensureTransaction(options);
  }
}
