
import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import { IAuthUser } from "../../interfaces/common";
import pick from "../../../shared/pick";
import { doctorScheduleService } from "./scheduleDoctor.service";

const insertIntoDb = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user;
    const result = await doctorScheduleService.insertIntoDB(user, req.body)
    sendResponse(res, {
        statusCode: status.OK,
        massage: "Doctor Schedule created successfully.",
        success: true,
        data: result

    })
})

const getMySchedule = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const filters = pick(req.query, ['startDate', 'endDate', 'isBooked']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const user = req.user;
    const result = await doctorScheduleService.getMySchedule(filters, options, user as IAuthUser);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "My Schedule fetched successfully!",
        data: result
    });
});
const deleteFromDB = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {

    const user = req.user;
    const { id } = req.params;
    const result = await doctorScheduleService.deleteFromDB(user as IAuthUser, id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "My Schedule deleted successfully!",
        data: result
    });
});

export const doctorScheduleController = {
    insertIntoDb,
    getMySchedule,
    deleteFromDB
}