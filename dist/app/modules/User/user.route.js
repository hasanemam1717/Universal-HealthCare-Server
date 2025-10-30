"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const index_d_1 = require("./../../../generated/prisma/index.d");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const fileUploaders_1 = require("../../../helpers/fileUploaders");
const user_validation_1 = require("./user.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(index_d_1.UserRole.ADMIN, index_d_1.UserRole.SUPER_ADMIN), user_controller_1.userController.getAllUserFromDB);
router.get('/me', (0, auth_1.default)(index_d_1.UserRole.ADMIN, index_d_1.UserRole.SUPER_ADMIN, index_d_1.UserRole.PATIENT, index_d_1.UserRole.DOCTOR), user_controller_1.userController.getMyProfile);
router.post("/create-admin", (0, auth_1.default)(index_d_1.UserRole.ADMIN, index_d_1.UserRole.SUPER_ADMIN), fileUploaders_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.userValidation.createAdmin.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createAdmin(req, res);
});
router.post("/create-doctor", (0, auth_1.default)(index_d_1.UserRole.SUPER_ADMIN, index_d_1.UserRole.ADMIN), fileUploaders_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.userValidation.createDoctor.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createDoctor(req, res);
});
router.post("/create-patient", fileUploaders_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = user_validation_1.userValidation.createPatient.parse(JSON.parse(req.body.data));
    return user_controller_1.userController.createPatient(req, res, next);
});
router.patch("/update-my-profile", (0, auth_1.default)(index_d_1.UserRole.ADMIN, index_d_1.UserRole.SUPER_ADMIN, index_d_1.UserRole.PATIENT, index_d_1.UserRole.DOCTOR), fileUploaders_1.fileUploader.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    return user_controller_1.userController.updateMyProfile(req, res, next);
});
router.patch("/:id/status", (0, auth_1.default)(index_d_1.UserRole.SUPER_ADMIN, index_d_1.UserRole.ADMIN), (0, validateRequest_1.default)(user_validation_1.userValidation.updateStatus), user_controller_1.userController.changeProfileStatus);
exports.userRoutes = router;
