/** @module models */

/**
 * A human user in our system.
 */
export interface IUser {
  /** Unique identifier of user. */
  id: string;
  /** First name of user. */
  firstName: string;
  /** Last name of user. */
  lastName: string;
  /** Email adress of user. */
  email: string;
  /** Assigned user role of user. */
  role: EUserRole;
}

/** Enum of all existing user roles. */
export enum EUserRole {
  /** Administrator. */
  Admin = 'admin',
  /** Student User. */
  Student = 'student',
  /** Staff User. */
  Staff = 'staff',
}

/** List of all possible values for any type-`EUserRole` variable. */
export const userRoles: string[] = Object.keys(EUserRole).map(
  key => EUserRole[key as any] as EUserRole,
);
