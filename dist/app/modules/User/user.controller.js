"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const user_constance_1 = require("./user.constance");
const pick_1 = __importDefault(require("../../../shared/pick"));
const createAdmin = async (req, res) => {
    const result = await user_service_1.userService.createAdmin(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Admin Created successfully!",
        data: result
    });
};
const createDoctor = async (req, res) => {
    const result = await user_service_1.userService.createDoctor(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Doctor Created successfully!",
        data: result
    });
};
const createPatient = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.userService.createPatient(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Patient Created successfully!",
        data: result
    });
});
const getAllUserFromDB = (0, catchAsync_1.default)(async (req, res) => {
    // console.log(req.query)
    const filters = (0, pick_1.default)(req.query, user_constance_1.userFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await user_service_1.userService.getAllUserFromDb(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Users data fetched!",
        meta: result.meta,
        data: result.data
    });
});
const changeProfileStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.userService.changeProfileStatus(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Users profile status changed!",
        data: result
    });
});
const getMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await user_service_1.userService.getMyProfile(user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "My profile data retrieved",
        data: result
    });
});
const updateMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await user_service_1.userService.updateMyProfile(user, req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Update my profile data",
        data: result
    });
});
exports.userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDB,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
};
