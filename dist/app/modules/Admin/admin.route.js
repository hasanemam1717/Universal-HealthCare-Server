"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_validation_1 = require("./admin.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const index_d_1 = require("./../../../generated/prisma/index.d");
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(index_d_1.UserRole.ADMIN, index_d_1.UserRole.SUPER_ADMIN), admin_controller_1.adminController.getAllAdminData);
router.get('/:id', (0, auth_1.default)(index_d_1.UserRole.ADMIN, index_d_1.UserRole.SUPER_ADMIN), admin_controller_1.adminController.getDataById);
router.patch('/:id', (0, auth_1.default)(index_d_1.UserRole.ADMIN, index_d_1.UserRole.SUPER_ADMIN), (0, validateRequest_1.default)(admin_validation_1.adminValidationSchemas.update), admin_controller_1.adminController.updateIntoDb);
router.delete('/:id', (0, auth_1.default)(index_d_1.UserRole.ADMIN, index_d_1.UserRole.SUPER_ADMIN), admin_controller_1.adminController.deleteFromDb);
router.delete('/soft/:id', (0, auth_1.default)(index_d_1.UserRole.ADMIN, index_d_1.UserRole.SUPER_ADMIN), admin_controller_1.adminController.softDeleteFromDb);
exports.adminRoutes = router;
