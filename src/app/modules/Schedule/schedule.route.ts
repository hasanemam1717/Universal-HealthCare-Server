import express, { NextFunction, Request, Response } from 'express';
import { scheduleController } from './schedule.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma';
const router = express.Router()

router.post('/', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), scheduleController.insertIntoDb)
export const scheduleRotes = router