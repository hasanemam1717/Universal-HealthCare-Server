import express from 'express';
import { prescriptionController } from './prescription.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
const router = express.Router()
router.post('/', auth(UserRole.DOCTOR), prescriptionController.insertIntoDb)
router.get('/my-prescription', auth(UserRole.PATIENT), prescriptionController.getPatientPrescription)

export const prescriptionRoute = router