/** @module app/models/subject-user */

import {
  Column,
  Table,
  ForeignKey,
} from 'sequelize-typescript';
import { Model } from '../base/model';
import { User } from '../user';
import Subject from '../subject/subject.model';

@Table({
    tableName: 'subject-user',
})

export class UserSubject extends Model<UserSubject> {
    @ForeignKey(() => Subject)
    @Column
    subjectId: string

    @ForeignKey(() => User)
    @Column
    userId: string
}

export default UserSubject

