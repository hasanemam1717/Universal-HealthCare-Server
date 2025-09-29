import express from 'express';
import { appointmentController } from './appointment.contoller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma';
const route = express.Router()

route.post('/', auth(UserRole.PATIENT), appointmentController.createAppointment)

export const appointmentRoutes = route


