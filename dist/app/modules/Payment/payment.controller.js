"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const payment_service_1 = require("./payment.service");
const initPayment = (0, catchAsync_1.default)(async (req, res) => {
    const { appointmentId } = req.params;
    const result = await payment_service_1.paymentService.initPayment(appointmentId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: 'Payment initialized successfully',
        data: result
    });
});
const validatePayment = (0, catchAsync_1.default)(async (req, res) => {
    const result = await payment_service_1.paymentService.validatePayment(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        massage: 'Payment validate successfully',
        data: result
    });
});
exports.paymentController = { initPayment, validatePayment };
