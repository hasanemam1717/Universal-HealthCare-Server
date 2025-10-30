"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const index_d_1 = require("./../../../generated/prisma/index.d");
const meta_controller_1 = require("./meta.controller");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(index_d_1.UserRole.PATIENT, index_d_1.UserRole.ADMIN, index_d_1.UserRole.DOCTOR, index_d_1.UserRole.SUPER_ADMIN), meta_controller_1.metaController.getMetaForDashBoard);
// get all review with auth super admin and admin to see this 
exports.metaRoutes = router;
