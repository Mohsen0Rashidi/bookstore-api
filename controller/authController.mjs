import jwt from 'jsonwebtoken'
import passport from 'passport'
import passportJWT from 'passport-jwt'
import crypto from 'crypto'
import dotenv from 'dotenv'
dotenv.config()
import User from '../models/userModel.mjs'
import catchAsyncErrors from '../utils/catchAsyncErrors.mjs'
import AppError from '../utils/appError.mjs'
import { sendEmail } from '../utils/email.mjs'

const { sign } = jwt
const { Strategy: JWTStrategy, ExtractJwt } = passportJWT

const cookieOpt = {}

/**
 * Extracts the JWT token from the request cookies.
 *
 * @param {Object} req - The request object.
 * @returns {string|null} The JWT token, or null if not found.
 */
const cookieExtractor = (req) => {
  // Check if the request object and its cookies exist.
  let token = null
  if (req && req.cookies) {
    // Extract the JWT token from the 'jwt' cookie.
    token = req.cookies['jwt']
  }

  // Return the extracted token.
  return token
}

// Set the cookieExtractor function as the function to extract the JWT from the request cookies.
cookieOpt.jwtFromRequest = cookieExtractor

// Set the secret used to sign the JWTs to the value stored in the PASSPORT_SECRET environment variable.
cookieOpt.secretOrKey = process.env.PASSPORT_SECRET

// Create a new JWTStrategy using the cookieExtractor and the secret, and set it as a middleware to be used by passport.
passport.use(
  new JWTStrategy(cookieOpt, async (jwt_payload, done) => {
    // Try to find a user with the ID from the JWT payload.
    try {
      const user = await User.findById(jwt_payload.id)

      if (user) {
        return done(null, user)
      }
      return done(null, false)
    } catch (error) {
      return done(error, null)
    }
  }),
)

// Export a function that can be used as passport middleware to authenticate the request using the JWT strategy.
export const authenticateJwt = passport.authenticate('jwt', { session: false })

/**
 * Sign a token with the given ID
 * @param {string} id - The ID to sign the token with
 * @returns {string} - The signed token
 */
const signToken = (id) => {
  return sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  })
}

/**
 * Create and send a JWT token to the user along with user data
 * @param {Object} user - The user object
 * @param {number} statusCode - The status code for the response
 * @param {Object} res - The response object
 */
const createSendToken = (user, statusCode, res) => {
  // Create a JWT token for the user
  const token = signToken(user._id)

  // Set cookie options for JWT token
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  }

  // Set cookie to secure in production environment
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true
  }

  // Hide user password from the response
  user.password = undefined

  // Send JWT token in a cookie and user data in the response
  res.cookie('jwt', token, cookieOptions)
  res.status(statusCode).json({
    status: 'ok',
    token,
    data: { user },
  })
}

/**
 * Handles user sign up
 * @param {object} req - The request object
 * @param {object} res - The response object
 */
export const signUp = catchAsyncErrors(async (req, res) => {
  // Destructure the required fields from the request body
  const { name, email, photo, password, passwordConfirm } = req.body
  // Create a new user with the provided information
  const user = await User.create({
    name,
    email,
    photo,
    password,
    passwordConfirm,
  })

  // Send a token to the user after successful sign up
  createSendToken(user, 200, res)
})

/**
 * Handles user login
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @param {function} next - The next middleware function
 */
export const login = catchAsyncErrors(async (req, res, next) => {
  // Destructure email and password from request body
  const { email, password } = req.body

  // Check if email and password are provided
  if (!email || !password) {
    // Return an error if they are not provided
    return next(new AppError('Please provide email and password', 400))
  }

  // Find user by email and select password
  const user = await User.findOne({ email }).select('+password')

  console.log(`loged user:${user}`)
  // Check if user exists and password is correct
  if (!user || !(await user.comparePassword(password, user.password))) {
    // Return an error if user or password is incorrect
    return next(new AppError('Incorrect email or password', 404))
  }

  // Send a token to the user after successful login
  createSendToken(user, 200, res)
})

/**
 * Middleware function to check if the user is an admin.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export const isAdmin = (req, res, next) => {
  // Check if the user exists and if the user's role is 'admin'.
  // If both conditions are true, then proceed to the next middleware,
  // otherwise return an error.

  // Check if the request object has a user property.
  if (req.user && req.user.role === 'admin') {
    // If the user is an admin, proceed to the next middleware.
    next()
  } else {
    // If the user is not an admin, return an error.
    return next(
      new AppError('You are not authorized to access this resource', 403),
    )
  }
}

/**
 * Middleware function to update the user's password.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  // Find the user by ID and select the password field.
  const user = await User.findById(req.user.id).select('+password')

  // Check if the current password is correct.
  if (!(await user.comparePssword(req.body.currentPassword, user.password))) {
    // Return an error if the current password is wrong.
    return next(new AppError('Your current password is wrong', 401))
  }

  // Update the user's password and password confirmation.
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  // Save the updated user to the database.
  await user.save()

  // Send a token to the user after successful password update.
  createSendToken(user, 200, res)
})

/**
 * Function to handle forgot password requests.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  /**
   * Destructure the email from the request body.
   */
  const { email } = req.body

  /**
   * Find the user by email.
   */
  const user = await User.findOne({ email })

  /**
   * Return an error if user is not found.
   */
  if (!user) {
    return next(new AppError('User not found with that ID', 404))
  }

  /**
   * Generate a password reset token for the user.
   */
  const resetToken = user.generatePasswordResetToken()
  console.log(`in forgot function:${resetToken}`)
  /**
   * Save the user to the database.
   */
  await user.save({ validateBeforeSave: false })

  /**
   * Generate the reset URL.
   */
  const resetURL = `${req.protocol}://${req.get(
    'host',
  )}/api/v1/user/reset-password/${resetToken}`

  /**
   * Generate the email text.
   */
  const text = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`

  /**
   * Generate the email subject.
   */
  const subject = 'Your password reset token (valid for 10 minutes)'

  try {
    /**
     * Send the email.
     */
    await sendEmail(email, subject, text)

    /**
     * Send a response to the client.
     */
    res.status(200).json({
      status: 'ok',
      message: 'Token sent to email',
    })
  } catch (err) {
    /**
     * Handle errors in sending the email.
     */
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    /**
     * Return an error to the client.
     */
    return next(
      new AppError(
        'There was an error sending the email, Please try again later',
        500,
      ),
    )
  }
})

/**
 * Function to handle password reset requests.
 *
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  /**
   * Destructure the token from the request parameters.
   */
  const { token } = req.params

  /**
   * Hash the token.
   */
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
  /**
   * Find the user by the hashed token and expiration time.
   */
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })

  /**
   * Return an error if the token is invalid or expired.
   */
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }

  /**
   * Update the user's password and password confirmation.
   */
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  /**
   * Send a token to the user after successful password update.
   */
  createSendToken(user, 200, res)
})
