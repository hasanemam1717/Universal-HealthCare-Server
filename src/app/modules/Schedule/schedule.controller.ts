import { Request, Response } from "express"
import catchAsync from "../../../shared/catchAsync"
import sendResponse from "../../../shared/sendResponse"
import status from "http-status"
import { scheduleService } from "./schedule.service"


const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
    const result = await scheduleService.insertIntoDb(req.body)
    sendResponse(res, {
        statusCode: status.OK,
        massage: "Schedule created successfully.",
        success: true,
        data: result

    })
})

export const scheduleController = {
    insertIntoDb,
}