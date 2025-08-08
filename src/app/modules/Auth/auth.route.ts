import express from 'express';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma';
const router = express.Router()

router.post('/login', authController.logInUser)
router.post('/refreshToken', authController.refreshToken)
router.post('/change-password', auth(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT, UserRole.SUPER_ADMIN), authController.changePassword)
router.post('/forgot-password',
    authController.forgotPassword
)
router.post(
    '/reset-password',
    authController.resetPassword
)
export const authRouter = router