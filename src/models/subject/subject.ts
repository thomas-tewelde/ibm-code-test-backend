/** @module models */

/**
 * A Subject in our system
 */
export interface ISubject {
    /** Unique identifier of subject. */
    id: string;
    /** Unique Code of subject. */
    subjectCode: string;
    /** Descriotion of subject. */
    subjectDesc: string;
    /** Week starting of subject. */
    weekStartDate: string;
    /** Weed end date of subject. */
    weekEndDate: string;
    /** Date the subject happens. */
    exactClassDate: string;
    /** Day subject is thought. */
    dayOfWeek: string;
    /** room number of subject. */
    roomNumber: string;
    /** room of subject. */
    room: string;
    /** location subject is taken. */
    gpsCoordinates: string;
    /** Time start ofsubject. */
    startTime: string;
    /** Time end of subject. */
    endTime: string;
    /** Campus code for subject. */
    campusCode: ECampusCode;
    /** Room description  subject. */
    hasStandardrRoomDescription: boolean;
    /** duration number of subject. */
    duration: number;
    /** duration Code of subject. */
    durationCode: string;
    /** Indicates if subject taken on holiday. */
    isholiday: boolean;
  }
  
  /** Enum of campus code. */
  export enum ECampusCode {
    /** Sydney campus. */
    SY = 'sy',
    /** WA campus. */
    WA = 'wa',
  }
