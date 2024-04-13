import express from 'express'
import {
  getAllBooks,
  addBook,
  getBook,
  updateBook,
  deleteBook,
} from '../controller/bookController.mjs'
import { authenticateJwt, isAdmin } from '../controller/authController.mjs'

const router = express.Router()

router.route('/').get(getAllBooks).post(authenticateJwt, isAdmin, addBook)

router.use(authenticateJwt)
router
  .route('/:id')
  .get(getBook)
  .patch(isAdmin, updateBook)
  .delete(isAdmin, deleteBook)

export default router
