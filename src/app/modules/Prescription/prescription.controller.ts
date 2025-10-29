import httpStatus from 'http-status';
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from 'express';
import { prescriptionService } from './prescription.service';
import { IAuthUser } from '../../interfaces/common';

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

export const prescriptionController = { insertIntoDb }