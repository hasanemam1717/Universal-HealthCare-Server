import express, { NextFunction, Request, Response } from 'express';
import { scheduleController } from './schedule.controller';
const router = express.Router()

router.post('/', scheduleController.insertIntoDb)
export const scheduleRotes = router