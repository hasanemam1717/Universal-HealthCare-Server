import express from 'express';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma';
import { appointmentController } from './appointment.controller';
const route = express.Router()

route.post('/', auth(UserRole.PATIENT), appointmentController.createAppointment)
route.get('/my-appointment', auth(UserRole.PATIENT, UserRole.DOCTOR), appointmentController.getMyAppointment)

export const appointmentRoutes = route


