import express from "express";
import { adminController } from "./admin.controller";

const router = express.Router()

router.get("/", adminController.getAllAdminData)
router.get('/:id', adminController.getDataById)
router.patch('/:id', adminController.updateIntoDb)
router.delete('/:id', adminController.deleteFromDb)
router.delete('/soft/:id', adminController.softDeleteFromDb)

export const adminRoutes = router