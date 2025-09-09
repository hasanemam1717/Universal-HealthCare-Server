

import express, { NextFunction, Request, Response } from "express";
import { adminController } from "./admin.controller";
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validation';
import auth from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = express.Router()



router.get("/",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    adminController.getAllAdminData)
router.get('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.getDataById)
router.patch('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    validateRequest(adminValidationSchemas.update),
    adminController.updateIntoDb)
router.delete('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.deleteFromDb)
router.delete('/soft/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminController.softDeleteFromDb)

export const adminRoutes = router