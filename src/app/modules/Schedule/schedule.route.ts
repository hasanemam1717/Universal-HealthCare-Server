import { UserRole } from '@prisma/client';

import express from 'express';
import { ScheduleController } from './schedule.controller';
import auth from '../../middlewares/auth';


const router = express.Router();

router.get(
    '/',
    auth(UserRole.DOCTOR),
    ScheduleController.getAllFromDB
);

router.get(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
    ScheduleController.getByIdFromDB
);

router.post(
    '/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    ScheduleController.insertIntoDB
);




router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    ScheduleController.deleteFromDB
);

export const scheduleRoutes = router;