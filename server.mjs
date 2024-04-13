import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
import app from './app.mjs'

const database = process.env.DATABASE
console.log(process.env.NODE_ENV)


/**
 * Connect to the database using Mongoose
 * @returns {Promise} A promise that resolves when the connection is established
 */
mongoose.connect(database).then(() => {
  // Log a success message when the connection is established
  console.log('Connected to database')
})

/**
 * Start the app server and listen on port 3000
 */
app.listen(3000, () => {
  // Log a success message when the app is running successfully
  console.log('App running successfully')
})
