/** @module app/errors */

export interface IAppErrorOptions {
  original?: Error;
  payload?: any;
  statusCode?: number;
}

/**
 * Base app error.
 *
 * All other errors extend this abstract class.
 */
export abstract class AppError extends Error {
  /**
   * @param code Error code. Useful for programmatic handling of errors.
   * @param message Error message. Describes what went wrong.
   * @param options Error options
   */
  constructor(
    public code: string,
    public message: string,
    private options: IAppErrorOptions = {},
  ) {
    super(message);
  }

  /**
   * Original error.
   */
  public get original() {
    return this.options.original;
  }

  /**
   * Error payload. Arbitrary data concerning the error.
   */
  public get payload() {
    return this.options.payload;
  }

  /**
   * HTTP status code e.g. 404.
   */
  public get statusCode() {
    return this.options.statusCode || 500;
  }

  /**
   * Return JSON-representation of the error object.
   */
  public toJSON() {
    return {
      code: this.code,
      message: this.message,
      payload: this.payload,
    };
  }

  /**
   * Return JSON-representation of the original object.
   */
  public getOriginalJSON() {
    if (!this.original) {
      return null;
    }
    return getErrorJSON(this.original);
  }
}

/**
 * Return JSON-representation of the error object,
 * @param error Target error object
 */
export function getErrorJSON(error: Error) {
  return {
    name: error.name,
    message: error.message,
    stack: error.stack,
  };
}
