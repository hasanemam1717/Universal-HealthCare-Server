"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduleController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const schedule_service_1 = require("./schedule.service");
const insertIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await schedule_service_1.scheduleService.insertIntoDb(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Schedule created successfully!",
        data: result
    });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, ['startDate', 'endDate']);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const user = req.user;
    const result = await schedule_service_1.scheduleService.getAllFromDB(filters, options, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Schedule fetched successfully!",
        data: result
    });
});
const getByIdFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await schedule_service_1.scheduleService.getByIdFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: 'Schedule retrieval successfully',
        data: result,
    });
});
const deleteFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await schedule_service_1.scheduleService.deleteFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: 'Schedule deleted successfully',
        data: result,
    });
});
exports.ScheduleController = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    deleteFromDB
};
