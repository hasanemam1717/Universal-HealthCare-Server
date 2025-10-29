"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sslService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const initPayment = async (paymentData) => {
    try {
        const { amount, transactionId, patientName, patientEmail, patientAddress, patientPhoneNumber } = paymentData;
        const data = {
            store_id: config_1.default.ssl.store_id,
            store_passwd: config_1.default.ssl.store_pass,
            total_amount: amount,
            currency: 'BDT',
            tran_id: transactionId, // use unique tran_id for each api call
            success_url: config_1.default.ssl.success_url,
            fail_url: config_1.default.ssl.fail_url,
            cancel_url: config_1.default.ssl.cancel_url,
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'N/A',
            product_name: 'Appointment.',
            product_category: 'Service',
            product_profile: 'general',
            cus_name: patientName,
            cus_email: patientEmail,
            cus_add1: patientAddress,
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: patientPhoneNumber,
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'N/A',
            ship_add2: 'N/A',
            ship_city: 'N/A',
            ship_state: 'N/A',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };
        const response = await (0, axios_1.default)({
            method: "post",
            url: "https://sandbox.sslcommerz.com/gwprocess/v3/api.php",
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        return response.data;
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Payment error occurred.");
    }
};
const validatePayment = async (payload) => {
    try {
        const response = await (0, axios_1.default)({
            method: "GET",
            url: `${config_1.default.ssl.ssl_validation_url}?val_id=${payload.val_id}&store_id${config_1.default.ssl.store_id}&store_passw${config_1.default.ssl.store_pass}&format=json`
        });
        return response.data;
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Payment validation FAIL!");
    }
};
exports.sslService = {
    initPayment,
    validatePayment
};
