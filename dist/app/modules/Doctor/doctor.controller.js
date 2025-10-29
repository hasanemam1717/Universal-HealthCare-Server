"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorController = void 0;
const pick_1 = __importDefault(require("../../../shared/pick"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const doctor_constant_1 = require("./doctor.constant");
const doctor_service_1 = require("./doctor.service");
const getAllDoctorData = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, doctor_constant_1.doctorFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await doctor_service_1.doctorService.getAllDoctorData(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: 'Doctors retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getDataById = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    const result = await doctor_service_1.doctorService.getDataById(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Doctor get by id",
        data: result
    });
});
const updateIntoDb = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await doctor_service_1.doctorService.updateIntoDb(id, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Doctor updated by id",
        data: result
    });
});
const deleteFromDb = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await doctor_service_1.doctorService.deleteFromDb(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Doctor delete by id",
        data: result
    });
});
const softDeleteFromDb = (0, catchAsync_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const result = await doctor_service_1.doctorService.softDeleteFromDb(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Doctor get by id",
        data: result
    });
});
exports.doctorController = {
    getAllDoctorData,
    getDataById,
    updateIntoDb,
    deleteFromDb,
    softDeleteFromDb
};
