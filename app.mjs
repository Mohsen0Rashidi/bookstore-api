import express from 'express'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import bookRouter from './routes/bookRoutes.mjs'
import userRouter from './routes/userRoutes.mjs'
import globalErrorHandler from './controller/errorController.mjs'
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1/book', bookRouter)
app.use('/api/v1/user', userRouter)

// Error handler middleware
app.use(globalErrorHandler)

export default app
