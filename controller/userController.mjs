import User from '../models/userModel.mjs'
import AppError from '../utils/appError.mjs'
import catchAsyncErrors from '../utils/catchAsyncErrors.mjs'

/**
 * Get all users.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const getUsers = catchAsyncErrors(async (req, res, next) => {
  // Find all users in the database
  const users = await User.find()

  // Send the response with status, result and data
  res.status(200).json({
    status: 'ok',
    results: users.length,
    data: users,
  })
})


/**
 * Get a user by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const getUser = catchAsyncErrors(async (req, res, next) => {
  // Find a user by its ID
  const user = await User.findById(req.params.id)

  // If no user is found, throw an error
  if (!user) {
    // Throw a new AppError with a specific message and status code
    return next(new AppError('User not found with this ID', 404))
  }

  // Send the response with status, result and data
  res.status(200).json({
    status: 'ok',
    data: user,
  })
})

/**
 * Update a user by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  // Find a user by its ID and update it with the request body.
  // The new: true option in the query options returns the updated document.
  // The runValidators option ensures that the document is validated before updating.
  
  // Perform the update
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true, runValidators: true }
  )

  // Send the response with status, result and data
  res.status(200).json({
    status: 'ok',
    data: { updatedUser },
  })
})

/**
 * Delete a user by its ID.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  // Find the user by its ID and delete it.
  // The 'delete' method returns null, and we send a 204 No Content response.
  // The response data is null.

  // Find and delete the user with the provided ID.
  await User.findByIdAndDelete(req.params.id)

  // Send the response with status and data.
  // The response is a 204 No Content with null data.
  res.status(204).json({
    status: 'ok',
    data: null,
  })
})

/**
 * Update the logged in user's information.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const updateMe = catchAsyncErrors(async (req, res, next) => {
  // Check if the request body contains 'name' and 'email' properties
  // If it does, update the user's information and send the updated user
  // If it doesn't, throw an error

  // The updated user
  let updatedUser

  // Check if 'name' and 'email' are present in the request body
  if ('name' in req.body && 'email' in req.body) {
    // Find and update the user with the provided ID
    updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    })
  } else {
    // Throw an error if the request body does not contain 'name' and 'email'
    return next(
      new AppError(
        'This route is not for update the password',
        400
      )
    )
  }

  // Send the response with status, result and data
  res.status(200).json({
    status: 'ok',
    data: {
      updatedUser,
    },
  })
})


/**
 * Delete the logged in user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const deleteMe = catchAsyncErrors(async (req, res, next) => {
  // Find the user by their ID and update the 'active' field to false, indicating the user has been deleted
  await User.findByIdAndUpdate(req.user.id, { active: false })

  // Send a 204 No Content response with an empty data object
  res.status(204).json({
    status: 'ok',
    data: null,
  })
})

/**
 * Retrieve the logged in user.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} The response object.
 */
export const getMe = catchAsyncErrors(async (req, res, next) => {
  // Set the user ID from the request to the user ID from the request.
  req.params.id = req.user.id

  // Call the next middleware function.
  next()
})


