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
        massage: "Refresh Token get in successfully.",
        success: true,
        data: result
        // data: {
        //     accessToken: result.accessToken,
        //     needsPasswordChange: result.needPasswordChange
        // }

    })
})

const changePassword = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user
    const result = await authService.changePassword(user, req.body)

    sendResponse(res, {
        statusCode: status.OK,
        massage: "Password change successfully.",
        success: true,
        data: result

    })
})
const forgotPassword = catchAsync(async (req: Request, res: Response) => {

    await authService.forgotPassword(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Check your email!",
        data: null
    })
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {

    const token = req.headers.authorization || "";

    await authService.resetPassword(token, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: "Password Reset!",
        data: null
    })
});

export const authController = {
    logInUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}