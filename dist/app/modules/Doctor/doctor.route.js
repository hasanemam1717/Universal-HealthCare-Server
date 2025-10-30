"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const prisma_1 = require("./../../../generated/prisma");
const doctor_controller_1 = require("./doctor.controller");
const router = express_1.default.Router();
router.get("/", 
// auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
doctor_controller_1.doctorController.getAllDoctorData);
router.get('/:id', (0, auth_1.default)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.SUPER_ADMIN), doctor_controller_1.doctorController.getDataById);
router.patch('/:id', (0, auth_1.default)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.SUPER_ADMIN), doctor_controller_1.doctorController.updateIntoDb);
router.delete('/:id', (0, auth_1.default)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.SUPER_ADMIN), doctor_controller_1.doctorController.deleteFromDb);
router.delete('/soft/:id', (0, auth_1.default)(prisma_1.UserRole.ADMIN, prisma_1.UserRole.SUPER_ADMIN), doctor_controller_1.doctorController.softDeleteFromDb);
exports.doctorRoutes = router;
