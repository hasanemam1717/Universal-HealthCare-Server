

import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { doctorController } from "./doctor.controller";

const router = express.Router()



router.get("/",
    // auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    doctorController.getAllDoctorData)
router.get('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), doctorController.getDataById)
router.patch('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    doctorController.updateIntoDb)
router.delete('/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), doctorController.deleteFromDb)
router.delete('/soft/:id', auth(UserRole.ADMIN, UserRole.SUPER_ADMIN), doctorController.softDeleteFromDb)

export const doctorRoutes = router