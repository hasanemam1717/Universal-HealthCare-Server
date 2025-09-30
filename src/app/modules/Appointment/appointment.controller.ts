import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { appointmentService } from "./appointment.service";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";

const createAppointment = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user
    const result = await appointmentService.createAppointment(user as IAuthUser, req.body)

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Appointment create successfully.",
        data: result
    })
});
const getMyAppointment = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user
    const filter = pick(req.query, ['status', 'paymentStatus'])
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await appointmentService.getMyAppointment(user as IAuthUser, filter, options)

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "My Appointment retrieving successfully.",
        data: result
    })
});

export const appointmentController = {
    createAppointment,
    getMyAppointment
}