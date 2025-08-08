import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const createAdmin = async (req: Request, res: Response) => {

    const result = await userService.createAdmin(req)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Admin Created successfully!",
        data: result
    })
}
const createDoctor = async (req: Request, res: Response) => {
    const result = await userService.createDoctor(req)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Doctor Created successfully!",
        data: result
    })
}

const createPatient = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createPatient(req);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Patient Created successfully!",
        data: result
    })
});
export const userController = {
    createAdmin,
    createDoctor,
    createPatient
}