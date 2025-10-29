"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const review_service_1 = require("./review.service");
const insertIntoDb = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await review_service_1.reviewService.insertIntoDb(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Patient review created successfully!",
        data: result
    });
});
exports.reviewController = { insertIntoDb };
