import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";
import { specialtiesService } from "./specialties.service";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {
    const result = await specialtiesService.insertIntoDb(req)
    sendResponse(res, {
        statusCode: status.OK,
        massage: "Specialties created successfully.",
        success: true,
        data: result

    })
})


const getAllSpecialtiesFromDb = catchAsync(async (req: Request, res: Response) => {
    const result = await specialtiesService.getAllSpecialtiesFromDb()
    sendResponse(res, {
        statusCode: status.OK,
        massage: "Specialties data retrieve successfully.",
        success: true,
        data: result

    })
})

const hardDeleteSpecialties = catchAsync(async (req: Request, res: Response) => {
    const result = await specialtiesService.hardDeleteSpecialties(req)
    sendResponse(res, {
        statusCode: status.OK,
        massage: "Specialties data deleted successfully.",
        success: true,
        data: result

    })
})



export const specialtiesController = {
    insertIntoDb,
    getAllSpecialtiesFromDb,
    hardDeleteSpecialties
}