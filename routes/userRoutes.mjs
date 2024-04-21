import { Router } from 'express'
import {
  authenticateJwt,
  isAdmin,
  updatePassword,
  signUp,
  login,
  forgotPassword,
  resetPassword,
} from '../controller/authController.mjs'
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} from '../controller/userController.mjs'

const router = Router()

router.post('/signup', signUp)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.patch('/reset-password/:token', resetPassword)

router.use(authenticateJwt)

router.get('/me', getMe, getUser)
router.post('/updateMyPassword', updatePassword)
router.patch('/updateMe', updateMe)
router.delete('/deleteMe', deleteMe)
router.route('/').get(getUsers)
router.route('/:id').get(getUser).patch(updateUser).delete(isAdmin, deleteUser)

export default router
