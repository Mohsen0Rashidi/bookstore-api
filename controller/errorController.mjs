import AppError from '../utils/appError.mjs'

/**
 * Function to handle validation errors.
 *
 * @param {object} err - The validation error object.
 * @returns {AppError} The AppError object.
 */
const handleValidationError = (err) => {
  // Get the error message from the validation error.
  const message = err.errors.name.message;
  
  // Create a new AppError object with the error message and status code.
  return new AppError(message, 400);
}


/**
 * Function to handle Cast errors.
 *
 * @param {object} err - The Cast error object.
 * @returns {AppError} The AppError object.
 */
const handleCastError = (err) => {
  // Extract the path and value from the Cast error.
  // Create a user-friendly error message.
  const message = `Invalid ${err.path}: ${err.value}.`;
  
  // Create a new AppError object with the error message and status code.
  return new AppError(message, 400);
}


/**
 * Sends an error response with stack trace in development mode.
 *
 * @param {Error} err - The error object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with error details.
 */
const sendErrorDev = (err, res) => {
  // Set the response status code and send a JSON object with details of the error.
  // Include the error status, message, and stack trace.
  res.status(err.statusCode).json({
    status: err.status, // The status of the error
    error: err, // The error object itself
    message: err.message, // The error message
    stack: err.stack, // The stack trace of the error
  });
}


/**
 * Sends an error response with appropriate details in production mode.
 *
 * @param {Error} err - The error object.
 * @param {Object} res - The response object.
 * @returns {Object} The response object with error details.
 */
const sendErrorProd = (err, res) => {
  // If the error is operational (i.e. not a system error),
  // send the error status and message as JSON in the response.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status, // The status of the error
      message: err.message, // The error message
    });
  } 
  // If the error is not operational (i.e. a system error),
  // send a generic error message as JSON in the response.
  else {
    res.status(500).json({
      status: 'error', // The status of the error
      message: 'Something went wrong!', // The error message
    });
  }
}

/**
 * Middleware function to handle errors in the application.
 * This function sends an appropriate error response based on the environment (development or production).
 *
 * @param {Error} err - The error object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export default (err, req, res, next) => {
  // Set default values for error status and status code.
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    // In development mode, send the error details with stack trace.
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    // In production mode, handle specific errors (ValidatorError and ObjectId) and send a generic error message.
    let error = { ...err }

    if (error.name === 'ValidatorError') {
      // Handle validation errors
      error = handleValidationError(error)
    }

    if (error.kind === 'ObjectId') {
      // Handle cast errors
      error = handleCastError(error)
    }

    // Send the error response in production mode.
    sendErrorProd(error, res)
  }
}
