"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptionController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const prescription_service_1 = require("./prescription.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const insertIntoDb = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const result = await prescription_service_1.prescriptionService.insertIntoDb(user, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Prescription created successfully!",
        data: result
    });
});
const getPatientPrescription = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    const options = (0, pick_1.default)(req.query, ["limit", 'page', 'sortBy', 'sortOrder']);
    const result = await prescription_service_1.prescriptionService.getPatientPrescription(user, options);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: "Prescription retrieved successfully!",
        meta: result.meta,
        data: result.data
    });
});
exports.prescriptionController = { insertIntoDb, getPatientPrescription };
