import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import status from "http-status";

const logInUser = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.logInUser(req.body)
    const { refreshToken } = result
    res.cookie('refreshToken', refreshToken, { secure: false, httpOnly: true })
    sendResponse(res, {
        statusCode: status.OK,
        massage: "Logged in successfully.",
        success: true,
        data: {
            accessToken: result.accessToken,
            needsPasswordChange: result.needPasswordChange
        }

    })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {

    const { refreshToken } = req.cookies
    const result = await authService.refreshToken(refreshToken)

    sendResponse(res, {
        statusCode: status.OK,
        massage: "Logged in successfully.",
        success: true,
        data: result
        // data: {
        //     accessToken: result.accessToken,
        //     needsPasswordChange: result.needPasswordChange
        // }

    })
})

export const authController = {
    logInUser,
    refreshToken
}