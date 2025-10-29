"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importStar(require("http-status"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const appointment_constant_1 = require("./appointment.constant");
const appointment_service_1 = require("./appointment.service");
const createAppointment = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await appointment_service_1.AppointmentService.createAppointment(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Appointment booked successfully!",
        data: result
    });
});
const getMyAppointment = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const filters = (0, pick_1.default)(req.query, ['status', 'paymentStatus']);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await appointment_service_1.AppointmentService.getMyAppointment(user, filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.status.OK,
        success: true,
        massage: 'My Appointment retrieve successfully',
        data: result
    });
});
const getAllFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const filters = (0, pick_1.default)(req.query, appointment_constant_1.appointmentFilterableFields);
    const options = (0, pick_1.default)(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await appointment_service_1.AppointmentService.getAllFromDB(filters, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: 'Appointment retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});
const changeAppointmentStatus = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const user = req.user;
    const result = await appointment_service_1.AppointmentService.changeAppointmentStatus(id, status, user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: 'Appointment status updated successfully',
        data: result,
    });
});
exports.AppointmentController = {
    createAppointment,
    getMyAppointment,
    getAllFromDB,
    changeAppointmentStatus
};
