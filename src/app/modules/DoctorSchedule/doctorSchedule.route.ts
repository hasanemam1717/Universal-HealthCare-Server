import express from 'express';
import { doctorScheduleController } from './scheduleDoctor.controller';
import { UserRole } from '../../../generated/prisma';
import auth from '../../middlewares/auth';

const router = express.Router()

router.post('/', auth(UserRole.DOCTOR), doctorScheduleController.insertIntoDb)


export const doctorScheduleRoutes = router  