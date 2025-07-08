import express from "express";
import { adminController } from "./admin.controller";

const router = express.Router()

router.get("/", adminController.getAllAdminData)
router.get('/:id', adminController.getDataById)
router.patch('/:id', adminController.updateIntoDb)
router.delete('/:id', adminController.deleteFromDb)

export const adminRoutes = router