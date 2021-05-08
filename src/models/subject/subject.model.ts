/** @module app/models/subject */

import * as Debug from 'debug';
import {
  BeforeSave,
  BeforeUpdate,
  Column,
  DataType,
  Table,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';

import { config } from '../../config';
import { Model } from '../base/model';
import { ISubject, ECampusCode } from './subject';
import { User } from '../user';
import { UserSubject } from '../subject-user';

const debug = Debug('app:data:subject');

@Table({
  tableName: 'subjects',
})
export class Subject extends Model<Subject> {
  @Column({
      allowNull: false,
      unique: true,
      type: DataType.STRING(32),
    validate: {
      len: [1, 32],
    },
  })
  subjectCode: ISubject['subjectCode'];

  @Column({
    type: DataType.STRING(256),
    validate: {
      len: [1, 256],
    },
  })
  subjectDesc: ISubject['subjectDesc'];

  @Column({
    allowNull: false,
    type: DataType.DATEONLY
  })
  weekStartDate: ISubject['weekStartDate'];

  @Column({
    allowNull: false,
    type: DataType.DATEONLY
  })
  weekEndDate: ISubject['weekEndDate'];

  @Column({
    allowNull: false,
    type: DataType.DATEONLY
  })
  exactClassDate: ISubject['exactClassDate'];

  @Column({
    allowNull: false,
    type: DataType.STRING(12),
    validate: {
      len: [1, 12],
    },
  })
  dayOfWeek: ISubject['dayOfWeek'];

  @Column({
    allowNull: false,
    type: DataType.FLOAT,
    validate: {
      len: [1, 32],
    },
  })
  roomNumber: ISubject['roomNumber'];

  @Column({
    allowNull: false,
    type: DataType.FLOAT,
    validate: {
      len: [1, 32],
    },
  })
  room: ISubject['room'];

  @Column({
    allowNull: false,
    type: DataType.STRING(256),
    validate: {
      len: [1, 256],
    },
  })
  gpsCoordinates: ISubject['gpsCoordinates'];

  @Column({
    allowNull: false,
    type: DataType.TIME,
  })
  startTime: ISubject['startTime'];

  @Column({
    allowNull: false,
    type: DataType.TIME,
  })
  endTime: ISubject['endTime'];
  
  @Column({
    allowNull: false,
    type: DataType.ENUM({
      values: ['sy', 'wa']
    }),
    validate: {
      isIn: [['sy', 'wa']],
    },
  })
  campusCode: ECampusCode;

  @Column({
    allowNull: false,
    defaultValue: true,
    type: DataType.BOOLEAN,
  })
  hasStandardrRoomDescription: ISubject['hasStandardrRoomDescription'];

  @Column({
    allowNull: false,
    defaultValue: 1,
    type: DataType.INTEGER,
  })
  duration: ISubject['duration'];

  @Column({
    allowNull: false,
    type: DataType.STRING(32),
    validate: {
      len: [1, 32],
    },
  })
  durationCode: ISubject['durationCode'];
  
  @Column({
    allowNull: false,
    defaultValue: false,
    type: DataType.BOOLEAN
  })
  isholiday: ISubject['isholiday'];
  
  @BelongsToMany(() => User, () => UserSubject)
  users: User[]


  /** Get the JSON representation of the user. */
  toJSON(): ISubject {
    return {
        id: this.id,
        subjectCode: this.subjectCode,
        subjectDesc: this.subjectDesc,
        weekStartDate: this.weekStartDate,
        weekEndDate: this.weekStartDate,
        exactClassDate: this.exactClassDate,
        dayOfWeek: this.dayOfWeek,
        roomNumber: this.roomNumber,
        room: this.room,
        gpsCoordinates: this.gpsCoordinates,
        startTime: this.startTime,
        endTime: this.endTime,
        campusCode: this.campusCode,
        hasStandardrRoomDescription: this.hasStandardrRoomDescription,
        duration: this.duration,
        durationCode: this.durationCode,
        isholiday: this.isholiday
    };
  }
}
export default Subject;
