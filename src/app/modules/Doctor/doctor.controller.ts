import { NextFunction, Request, Response } from "express";
import pick from "../../../shared/pick";
import sendResponse from "../../../shared/sendResponse";

import status from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { doctorFilterableFields } from "./doctor.constant";
import { doctorService } from "./doctor.service";





const getAllDoctorData = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);
    const result = await doctorService.getAllDoctorData(filters, options);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: 'Doctors retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});
const getDataById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    // console.log(id);
    const result = await doctorService.getDataById(id)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Doctor get by id",
        data: result
    })



})
const updateIntoDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await doctorService.updateIntoDb(id, req.body)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Doctor updated by id",
        data: result
    })
})


const deleteFromDb = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const result = await doctorService.deleteFromDb(id)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Doctor delete by id",
        data: result
    })

})
const softDeleteFromDb = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const result = await doctorService.softDeleteFromDb(id)
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Doctor get by id",
        data: result
    })


})
export const doctorController = {
    getAllDoctorData,
    getDataById,
    updateIntoDb,
    deleteFromDb,
    softDeleteFromDb
}