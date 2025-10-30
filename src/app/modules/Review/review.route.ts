import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { reviewController } from './review.controller';
const router = express.Router()
router.post('/', auth(UserRole.PATIENT), reviewController.insertIntoDb)
// get all review with auth super admin and admin to see this 

export const reviewRoutes = router