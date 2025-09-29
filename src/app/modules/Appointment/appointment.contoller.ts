import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { appointmentService } from "./appointment.service";
import { IAuthUser } from "../../interfaces/common";

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

export const appointmentController = {
    createAppointment
}