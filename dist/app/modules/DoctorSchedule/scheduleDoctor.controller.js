"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const scheduleDoctor_service_1 = require("./scheduleDoctor.service");
const doctorSchedule_constant_1 = require("./doctorSchedule.constant");
const insertIntoDb = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await scheduleDoctor_service_1.doctorScheduleService.insertIntoDB(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        massage: "Doctor Schedule created successfully.",
        success: true,
        data: result
    });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, doctorSchedule_constant_1.scheduleFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await scheduleDoctor_service_1.doctorScheduleService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: 'Doctor Schedule retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getMySchedule = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const user = req.user;
    const result = await scheduleDoctor_service_1.doctorScheduleService.getMySchedule(filters, options, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "My Schedule fetched successfully!",
        data: result
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const result = await scheduleDoctor_service_1.doctorScheduleService.deleteFromDB(user, id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "My Schedule deleted successfully!",
        data: result
    });
});
exports.doctorScheduleController = {
    insertIntoDb,
    getMySchedule,
    deleteFromDB,
    getAllFromDB
};
