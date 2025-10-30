"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ssl_service_1 = require("../SSL/ssl.service");
const index_d_1 = require("./../../../generated/prisma/index.d");
const initPayment = async (appointmentId) => {
    const paymentData = await prisma_1.default.payment.findFirstOrThrow({
        where: {
            appointmentId
        },
        include: {
            appointment: {
                include: {
                    patient: true
                }
            }
        }
    });
    const initPaymentData = {
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        patientName: paymentData?.appointment?.patient?.name,
        patientEmail: paymentData?.appointment?.patient?.email,
        patientAddress: paymentData?.appointment?.patient?.address,
        patientPhoneNumber: paymentData?.appointment?.patient?.contactNumber,
    };
    const result = await ssl_service_1.sslService.initPayment(initPaymentData);
    return {
        paymentUrl: result?.GatewayPageURL
    };
};
const validatePayment = async (payload) => {
    // When the server is deployed uncomment this code for ssl commerce.
    // if (!payload || !payload?.status || !(payload?.status === "VALID")) {
    //     return { message: "INVALID payment!" }
    // }
    // const response = await sslService.validatePayment(payload)
    // if (response?.status !== 'VALID') {
    //     return { message: "Payment FAIL!" }
    // }
    // When the server is deployed comment this code 
    const response = payload;
    await prisma_1.default.$transaction(async (tx) => {
        const updatedPaymentData = await tx.payment.update({
            where: {
                transactionId: response.tran_id
            },
            data: {
                status: index_d_1.PaymentStatus.PAID,
                paymentGatewayData: response
            }
        });
        await tx.appointment.update({
            where: {
                id: updatedPaymentData.appointmentId
            },
            data: {
                paymentStatus: index_d_1.PaymentStatus.PAID
            }
        });
    });
    return {
        message: "Payment successfully."
    };
};
exports.paymentService = { initPayment, validatePayment };
