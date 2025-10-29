import express from 'express';
import { prescriptionController } from './prescription.controller';
import { UserRole } from '../../../generated/prisma';
import auth from '../../middlewares/auth';
const router = express.Router()
router.post('/', auth(UserRole.DOCTOR), prescriptionController.insertIntoDb)

export const prescriptionRoute = router