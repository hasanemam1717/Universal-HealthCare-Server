"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const index_d_1 = require("./../../../generated/prisma/index.d");
const router = express_1.default.Router();
router.post('/login', auth_controller_1.authController.logInUser);
router.post('/refreshToken', auth_controller_1.authController.refreshToken);
router.post('/change-password', (0, auth_1.default)(index_d_1.UserRole.ADMIN, index_d_1.UserRole.DOCTOR, index_d_1.UserRole.PATIENT, index_d_1.UserRole.SUPER_ADMIN), auth_controller_1.authController.changePassword);
router.post('/forgot-password', auth_controller_1.authController.forgotPassword);
router.post('/reset-password', auth_controller_1.authController.resetPassword);
exports.authRouter = router;
