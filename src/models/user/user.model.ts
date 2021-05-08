/** @module app/models/user */

import * as bcrypt from 'bcrypt';
import * as Debug from 'debug';
import {
  BeforeSave,
  BeforeUpdate,
  Column,
  DataType,
  Table,
  BelongsToMany,
} from 'sequelize-typescript';

import {
  IUser,
  EUserRole,
  userRoles,
} from './';

import { config } from '../../config';
import { Model } from '../base/model';
import { Subject } from '../subject';
import { UserSubject } from '../subject-user';

const debug = Debug('app:data:user');

@Table({
  tableName: 'users',
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING(256),
    validate: {
      len: [0, 256],
    },
  })
  firstName: IUser['firstName'];

  @Column({
    type: DataType.STRING(256),
    validate: {
      len: [0, 256],
    },
  })
  lastName: IUser['lastName'];

  @Column({
    allowNull: false,
    unique: true,
    type: DataType.STRING(256),
    validate: {
      isEmail: true,
      len: [1, 256],
    },
  })
  email: IUser['email'];


  @BelongsToMany(() => Subject, () => UserSubject)
  subjects: Array<Subject & {UserSubject: UserSubject}>

  /**
   * Property populated ONLY when a (current or old) password
   * is being passed from the client to the server e.g. when
   * requesting JWT tokens.
   */
  // password: string;

  /**
   * Hash of the user's password; used to verify the user's
   * identity (through password) by hashing their password
   * and comparing the result with this value.
   */
  @Column({
    allowNull: false,
  })
  passwordHash: string;

  @Column({
    allowNull: false,
    defaultValue: 1,
    type: DataType.INTEGER,
  })
  jwtVersion: number;


  @Column({
    allowNull: false,
    type: DataType.ENUM({
      values: ['admin', 'student', 'staff']
    }),
    validate: {
      isIn: [['admin', 'student', 'staff']],
    },
  })
  role: EUserRole;

  @BeforeSave
  static async hashPassword(user: User) {
    if (user.previous('passwordHash') && !user.changed('passwordHash')) {
      return;
    }
    debug('hashing password before save');
    const { saltRounds } = config.auth.password;
    user.passwordHash = await bcrypt.hash(user.passwordHash, saltRounds);
  }

  @BeforeUpdate
  static async updateJWTVersion(user: User) {
    const doUpdate = ['email', 'passwordHash', 'role'].find(prop =>
      user.changed(prop as any),
    );
    if (!doUpdate) {
      return;
    }
    debug('updating JWT version');
    user.jwtVersion += 1;
  }

  async checkPassword(password: string) {
    debug('comparing password with hash in database');
    return await bcrypt.compare(password, this.passwordHash);
  }

  /** Get the JSON representation of the user. */
  toJSON(): IUser {
    return {
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      role: this.role,
    };
  }

  /** Return `true` if user is an admin. */
  get isAdmin() {
    return this.role === EUserRole.Admin;
  }
}
export default User;
