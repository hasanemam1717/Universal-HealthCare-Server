import { Request, Response } from "express";
import { adminService } from "./admin.service";
import pick from "../../../shared/pick";
import { adminFilterableFields } from "./admin.constant";


const getAllAdminData = async (req: Request, res: Response) => {
    try {
        const filters = pick(req.query, adminFilterableFields)
        const options = pick(req.query, ['page', 'limit', 'sortBy', 'sortOrder'])
        // console.log(options);
        const result = await adminService.getAllAdminData(filters, options)
        res.status(200).json({
            success: true,
            massage: "Admin get successfully.",
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

export const adminController = {
    getAllAdminData
}