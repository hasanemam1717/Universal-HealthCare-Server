import { Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import { userFilterableFields } from "./user.constance";
import pick from "../../../shared/pick";

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

const getAllUserFromDB = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, userFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])

    const result = await userService.getAllUserFromDb(filters, options)

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Users data fetched!",
        meta: result.meta,
        data: result.data
    })
});
const changeProfileStatus = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await userService.changeProfileStatus(id, req.body)

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Users profile status changed!",
        data: result
    })
});
export const userController = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDB,
    changeProfileStatus
}