import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { metaController } from './meta.controller';
const router = express.Router()
router.get('/', auth(UserRole.PATIENT, UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN), metaController.getMetaForDashBoard)
// get all review with auth super admin and admin to see this 

export const metaRoutes = router