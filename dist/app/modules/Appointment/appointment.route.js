"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const appointment_validation_1 = require("./appointment.validation");
const prisma_1 = require("../../../generated/prisma");
const appointment_controller_1 = require("./appointment.controller");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN), appointment_controller_1.AppointmentController.getAllFromDB);
router.get('/my-appointment', (0, auth_1.default)(prisma_1.UserRole.PATIENT, prisma_1.UserRole.DOCTOR), appointment_controller_1.AppointmentController.getMyAppointment);
router.post('/', (0, auth_1.default)(prisma_1.UserRole.PATIENT), (0, validateRequest_1.default)(appointment_validation_1.AppointmentValidation.createAppointment), appointment_controller_1.AppointmentController.createAppointment);
router.patch('/status/:id', (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.DOCTOR, prisma_1.UserRole.ADMIN), appointment_controller_1.AppointmentController.changeAppointmentStatus);
exports.appointmentRoutes = router;
