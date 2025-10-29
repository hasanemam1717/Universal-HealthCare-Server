"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminController = void 0;
const admin_service_1 = require("./admin.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const admin_constant_1 = require("./admin.constant");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const getAllAdminData = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, admin_constant_1.adminFilterableFields);
    const options = (0, pick_1.default)(req.query, ['page', 'limit', 'sortBy', 'sortOrder']);
    const result = await admin_service_1.adminService.getAllAdminData(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Admin data get successfully",
        meta: result.meta,
        data: result.data
    });
});
const getDataById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const result = await admin_service_1.adminService.getDataById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Admin get by id",
        data: result
    });
});
const updateIntoDb = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await admin_service_1.adminService.updateIntoDb(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Admin updated by id",
        data: result
    });
});
const deleteFromDb = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await admin_service_1.adminService.deleteFromDb(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Admin delete by id",
        data: result
    });
});
const softDeleteFromDb = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await admin_service_1.adminService.softDeleteFromDb(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Admin get by id",
        data: result
    });
});
exports.adminController = {
    getAllAdminData,
    getDataById,
    updateIntoDb,
    deleteFromDb,
    softDeleteFromDb
};
