import express from 'express';
import { doctorScheduleController } from './scheduleDoctor.controller';
import { UserRole } from './../../../generated/prisma';
import auth from '../../middlewares/auth';

const router = express.Router()
router.get(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
    doctorScheduleController.getAllFromDB
);
router.post('/', auth(UserRole.DOCTOR), doctorScheduleController.insertIntoDb)
router.get('/my-schedule', auth(UserRole.DOCTOR), doctorScheduleController.getMySchedule)
router.delete(
    '/:id',
    auth(UserRole.DOCTOR),
    doctorScheduleController.deleteFromDB
);

export const doctorScheduleRoutes = router  