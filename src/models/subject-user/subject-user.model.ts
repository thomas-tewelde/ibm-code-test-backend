/** @module app/models/subject-user */

import {
  Column,
  Table,
  ForeignKey,
  DataType,
} from 'sequelize-typescript';
import { Model } from '../base/model';
import { User } from '../user';
import Subject from '../subject/subject.model';

@Table({
    tableName: 'subject-user',
})

export class UserSubject extends Model<UserSubject> {
    @ForeignKey(() => Subject)
    @Column({
      unique: false,
      type: DataType.STRING(32)
    })
    subjectId: string

    @ForeignKey(() => User)
    @Column({
      unique: false,
      type: DataType.STRING(32)
    })
    userId: string
}

export default UserSubject

