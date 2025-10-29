import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";

import status from "http-status";
import catchAsync from "../../../shared/catchAsync";





const getAllAdminData = catchAsync(async (req: Request, res: Response) => {

    const filters = pick(req.query, adminFilterableFields)
    const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])
    const result = await adminService.getAllAdminData(filters, options)

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Admin data get successfully",
        meta: result.meta,
        data: result.data
    })


})
const getDataById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    // console.log(id);
    const result = await adminService.getDataById(id)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Admin get by id",
        data: result
    })



})
const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await adminService.updateIntoDb(id, req.body)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Admin updated by id",
        data: result
    })
})


const deleteFromDb = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const result = await adminService.deleteFromDb(id)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Admin delete by id",
        data: result
    })

})
const softDeleteFromDb = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const result = await adminService.softDeleteFromDb(id)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Admin get by id",
        data: result
    })


})
export const adminController = {
    getAllAdminData,
    getDataById,
    updateIntoDb,
    deleteFromDb,
    softDeleteFromDb
}