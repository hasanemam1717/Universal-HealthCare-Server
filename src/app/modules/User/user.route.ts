import express, { NextFunction, Request, Response } from "express";
import { userController } from "./user.controller";
import { UserRole } from "../../../generated/prisma";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploaders";
import { userValidation } from "./user.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router()



router.get('/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    userController.getAllUserFromDB
)

router.get('/me',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.PATIENT, UserRole.DOCTOR),
    userController.getMyProfile
)

router.post("/create-admin",
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        return userController.createAdmin(req, res)
    },
)

router.post(
    "/create-doctor",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createDoctor.parse(JSON.parse(req.body.data))
        return userController.createDoctor(req, res)
    }
);

router.post(
    "/create-patient",
    fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createPatient.parse(JSON.parse(req.body.data))
        return userController.createPatient(req, res, next)
    }
);
router.patch("/:id/status",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    validateRequest(userValidation.updateStatus),
    userController.changeProfileStatus
)

export const userRoutes = router