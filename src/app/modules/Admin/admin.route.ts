import { AnyZodObject } from './../../../../node_modules/zod/v3/types.d';

import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controller";
import { z } from "zod";
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validation';

const router = express.Router()



router.get("/", adminController.getAllAdminData)
router.get('/:id', adminController.getDataById)
router.patch('/:id', validateRequest(adminValidationSchemas.update), adminController.updateIntoDb)
router.delete('/:id', adminController.deleteFromDb)
router.delete('/soft/:id', adminController.softDeleteFromDb)

export const adminRoutes = router