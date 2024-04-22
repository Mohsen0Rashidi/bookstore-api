import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a Name.'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an Email.'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid Email.'],
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'User role should be either: user or admin',
    },
    default: 'user',
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please enter your password.'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password.'],
    validate: {
      validator: function (val) {
        return val === this.password
      },
      message: 'Password does not match!',
    },
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
})

/**
 * Middleware function to hash the user's password before saving.
 * It also removes the passwordConfirm field from the document.
 *
 * @param {function} next - The next middleware function.
 */
userSchema.pre('save', async function (next) {
  // If the document is not modified, skip the hashing process and move to the next middleware.
  if (!this.isModified || !this.password) return next()

  // Hash the user's password using bcrypt with a salt round of 12.
  this.password = await bcrypt.hash(this.password, 12)

  // Remove the passwordConfirm field from the document.
  this.passwordConfirm = undefined

  // Move to the next middleware.
  next()
})

/**
 * Middleware function to run before any find query on the User model.
 * It adds a filter to exclude documents where the 'active' field is false.
 *
 * @param {function} next - The next middleware function.
 */
userSchema.pre(/^find/, function (next) {
  // Add a filter to the query to exclude documents where the 'active' field is false.
  this.find({ active: { $ne: false } })

  // Move to the next middleware.
  next()
})

/**
 * Middleware function to compare a candidate password with the user's actual password.
 *
 * @param {string} candidatePassword - The password to compare.
 * @param {string} password - The user's actual password.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating if the passwords match.
 */
userSchema.methods.comparePassword = async function (
  candidatePassword,
  password,
) {
  // Use bcrypt to compare the candidate password with the user's actual password.
  // The function returns a promise that resolves to a boolean indicating if the passwords match.
  return await bcrypt.compare(candidatePassword, password)
}

/**
 * Generates a password reset token for the user.
 * The token is a 64 character hex string and is valid for 10 minutes.
 *
 * @returns {string} The generated password reset token.
 * @throws {Error} If crypto.randomBytes returns null or undefined.
 */
userSchema.methods.generatePasswordResetToken = function () {
  // Generate a random 32 byte hex string using crypto.
  const resetToken = crypto.randomBytes(32).toString('hex')
  if (!resetToken) {
    return new Error('Failed to generate random bytes')
  }

  // Hash the reset token using SHA256 and store it in the user document.
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  // Set the expiration date for the password reset token.
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  // Return the generated reset token.
  return resetToken
}

const User = mongoose.model('User', userSchema)
export default User
