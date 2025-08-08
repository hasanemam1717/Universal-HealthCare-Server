import { Request, Response } from "express";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {

    try {
        const result = await userService.createAdmin(req)
        res.status(200).json({
            success: true,
            massage: "Admin created successfully.",
            data: result
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            massage: err?.name || "Something went wrong.",
            data: err
        })
    }
}

export const userController = {
    createAdmin
}