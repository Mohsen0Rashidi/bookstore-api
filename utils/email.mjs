import { createTransport } from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()

/**
 * Sends an email using the provided email details.
 *
 * @param {string} email - The recipient's email address.
 * @param {string} subject - The subject of the email.
 * @param {string} text - The body of the email.
 * @return {Promise<void>} - A promise that resolves when the email is sent.
 */
export const sendEmail = async (email, subject, text) => {
  // Create a transporter using Nodemailer
  const transporter = createTransport({
    // Host and port details for the email server
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      // User credentials for the email server
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Details of the email to be sent
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Sender's email address
    to: email, // Recipient's email address
    subject, // Subject of the email
    text, // Body of the email
  }

  // Send the email using the transporter
  await transporter.sendMail(mailOptions)
}
