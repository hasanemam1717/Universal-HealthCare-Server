import express from 'express';
import { UserRole } from '../../../generated/prisma';
import { ScheduleController } from './schedule.controller';
import auth from '../../middlewares/auth';


const router = express.Router();

router.get(
    '/',
    auth(UserRole.DOCTOR),
    ScheduleController.getAllFromDB
);

/**
 * API ENDPOINT: /schedule/:id
 * 
 * Get schedule data by id
 */
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



/**
 * API ENDPOINT: /schedule/:id
 * 
 * Delete schedule data by id
 */

router.delete(
    '/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    ScheduleController.deleteFromDB
);

export const scheduleRoutes = router;