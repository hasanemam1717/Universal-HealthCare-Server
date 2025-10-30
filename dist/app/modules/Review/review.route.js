"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const prisma_1 = require("./../../../generated/prisma");
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
router.post('/', (0, auth_1.default)(prisma_1.UserRole.PATIENT), review_controller_1.reviewController.insertIntoDb);
// get all review with auth super admin and admin to see this 
exports.reviewRoutes = router;
