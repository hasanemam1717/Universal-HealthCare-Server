import express from 'express'
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { AppointmentValidation } from './appointment.validation';
import { AppointmentController } from './appointment.controller';
import { UserRole } from './../../../generated/prisma/index.d';

const router = express.Router();

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    AppointmentController.getAllFromDB
);

router.get(
    '/my-appointment',
    auth(UserRole.PATIENT, UserRole.DOCTOR),
    AppointmentController.getMyAppointment
)

router.post(
    '/',
    auth(UserRole.PATIENT),
    validateRequest(AppointmentValidation.createAppointment),
    AppointmentController.createAppointment
);


router.patch('/status/:id', auth(UserRole.SUPER_ADMIN, UserRole.DOCTOR, UserRole.ADMIN), AppointmentController.changeAppointmentStatus)


export const appointmentRoutes = router;