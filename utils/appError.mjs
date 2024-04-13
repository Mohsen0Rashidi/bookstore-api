/**
 * AppError class represents an application error with a status code.
 * It extends the built-in Error class and provides a constructor to initialize
 * the error object.
 */
export default class AppError extends Error {
  /**
   * Constructs a new AppError object.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code associated with the error.
   */
  constructor(message, statusCode) {
    // Call the parent class constructor with the error message
    super(message)

    /**
     * The HTTP status code associated with the error.
     * @type {number}
     */
    this.statusCode = statusCode

    /**
     * The status of the error. It is set to 'fail' if the status code starts with '4',
     * and 'error' otherwise.
     * @type {string}
     */
    this.status = statusCode.toString().startsWith('4') ? 'fail' : 'error'

    /**
     * Flag indicating if the error is operational. It is always set to true.
     * @type {boolean}
     */
    this.isOperational = true

    // Capture the stack trace for the error
    Error.captureStackTrace(this, this.constructor)
  }
}
