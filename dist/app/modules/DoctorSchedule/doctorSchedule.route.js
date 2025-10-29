"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorScheduleRoutes = void 0;
const express_1 = __importDefault(require("express"));
const scheduleDoctor_controller_1 = require("./scheduleDoctor.controller");
const prisma_1 = require("../../../generated/prisma");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(prisma_1.UserRole.SUPER_ADMIN, prisma_1.UserRole.ADMIN, prisma_1.UserRole.DOCTOR, prisma_1.UserRole.PATIENT), scheduleDoctor_controller_1.doctorScheduleController.getAllFromDB);
router.post('/', (0, auth_1.default)(prisma_1.UserRole.DOCTOR), scheduleDoctor_controller_1.doctorScheduleController.insertIntoDb);
router.get('/my-schedule', (0, auth_1.default)(prisma_1.UserRole.DOCTOR), scheduleDoctor_controller_1.doctorScheduleController.getMySchedule);
router.delete('/:id', (0, auth_1.default)(prisma_1.UserRole.DOCTOR), scheduleDoctor_controller_1.doctorScheduleController.deleteFromDB);
exports.doctorScheduleRoutes = router;
