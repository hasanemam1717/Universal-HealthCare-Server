import httpStatus from 'http-status';
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from 'express';
import { IAuthUser } from '../../interfaces/common';
import { metaService } from './meta.service';

const getMetaForDashBoard = catchAsync(async (req: Request & { user?: IAuthUser }, res: Response) => {
    const user = req.user

    const result = await metaService.getMetaForDashBoard(user as IAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        massage: "Meta data retrieve successfully!",
        data: result
    })
});

export const metaController = { getMetaForDashBoard }