import status from 'http-status';
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { paymentService } from "./payment.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const { appointmentId } = req.params
    const result = await paymentService.initPayment(appointmentId);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: 'Payment initialized successfully',
        data: result
    });
})
const validatePayment = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentService.validatePayment(req.query);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: 'Payment validate successfully',
        data: result
    });
})

export const paymentController = { initPayment, validatePayment }