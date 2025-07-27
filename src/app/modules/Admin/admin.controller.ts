import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../shared/sendResponse";

import status from "http-status";



const getAllAdminData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filters = pick(req.query, adminFilterableFields)
        const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])
        const result = await adminService.getAllAdminData(filters, options)

        sendResponse(res, {
            statusCode: status.OK,
            massage: "Admin data get successfully",
            meta: result.meta,
            data: result.data
        })

    } catch (err: any) {
        next(err)
    }
}
const getDataById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    console.log(id);
    try {
        const result = await adminService.getDataById(id)
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            massage: "Admin get by id",
            data: result
        })

    } catch (err: any) {
        next(err)
    }

}
const updateIntoDb = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try {
        const result = await adminService.updateIntoDb(id, req.body)
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            massage: "Admin updated by id",
            data: result
        })

    } catch (err: any) {
        next(err)
    }
}


const deleteFromDb = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try {
        const result = await adminService.deleteFromDb(id)
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            massage: "Admin delete by id",
            data: result
        })

    } catch (err: any) {
        next(err)
    }
}
const softDeleteFromDb = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    try {
        const result = await adminService.softDeleteFromDb(id)
        sendResponse(res, {
            statusCode: status.OK,
            success: true,
            massage: "Admin get by id",
            data: result
        })

    } catch (err: any) {
        next(err)
    }
}
export const adminController = {
    getAllAdminData,
    getDataById,
    updateIntoDb,
    deleteFromDb,
    softDeleteFromDb
}