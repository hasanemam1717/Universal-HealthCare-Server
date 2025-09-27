
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import { doctorScheduleService } from "./scheduleDoctor.service";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDb = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await doctorScheduleService.insertIntoDb(user, req.body)
    sendResponse(res, {
        statusCode: status.OK,
        massage: "Doctor Schedule created successfully.",
        success: true,
        data: result

    })
})

export const doctorScheduleController = {
    insertIntoDb
}