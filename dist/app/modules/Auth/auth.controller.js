"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const logInUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.authService.logInUser(req.body);
    const { refreshToken } = result;
    res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        massage: "Logged in successfully.",
        success: true,
        data: {
            accessToken: result.accessToken,
            needsPasswordChange: result.needPasswordChange
        }
    });
});
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await auth_service_1.authService.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        massage: "Refresh Token get in successfully.",
        success: true,
        data: result
        // data: {
        //     accessToken: result.accessToken,
        //     needsPasswordChange: result.needPasswordChange
        // }
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await auth_service_1.authService.changePassword(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        massage: "Password change successfully.",
        success: true,
        data: result
    });
});
const forgotPassword = (0, catchAsync_1.default)(async (req, res) => {
    await auth_service_1.authService.forgotPassword(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Check your email!",
        data: null
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const token = req.headers.authorization || "";
    await auth_service_1.authService.resetPassword(token, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Password Reset!",
        data: null
    });
});
exports.authController = {
    logInUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};
