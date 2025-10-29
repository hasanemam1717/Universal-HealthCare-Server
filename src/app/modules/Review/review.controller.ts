import httpStatus from 'http-status';
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from 'express';
import { IAuthUser } from '../../interfaces/common';
import { reviewService } from './review.service';

const insertIntoDb = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user

    const result = await reviewService.insertIntoDb(user as IAuthUser, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        massage: "Patient review created successfully!",
        data: result
    })
});

export const reviewController = { insertIntoDb }