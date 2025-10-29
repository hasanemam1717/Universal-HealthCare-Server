import httpStatus from 'http-status';
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from 'express';
import { prescriptionService } from './prescription.service';
import { IAuthUser } from '../../interfaces/common';
import pick from '../../../shared/pick';

const insertIntoDb = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user


    const result = await prescriptionService.insertIntoDb(user as IAuthUser, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        massage: "Prescription created successfully!",
        data: result
    })
});
const getPatientPrescription = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user
    const options = pick(req.query, ["limit", 'page', 'sortBy', 'sortOrder'])


    const result = await prescriptionService.getPatientPrescription(user as IAuthUser, options);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        massage: "Prescription retrieved successfully!",
        meta: result.meta,
        data: result.data
    })
});

export const prescriptionController = { insertIntoDb, getPatientPrescription }