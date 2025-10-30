"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptionRoute = void 0;
const express_1 = __importDefault(require("express"));
const prescription_controller_1 = require("./prescription.controller");
const prisma_1 = require("./../../../generated/prisma");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(prisma_1.UserRole.DOCTOR), prescription_controller_1.prescriptionController.insertIntoDb);
router.get('/my-prescription', (0, auth_1.default)(prisma_1.UserRole.PATIENT), prescription_controller_1.prescriptionController.getPatientPrescription);
exports.prescriptionRoute = router;
