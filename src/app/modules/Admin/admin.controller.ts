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
            meta: result.meta,
            data: result.data
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            massage: err?.name || "Something went wrong.",
            data: err
        })
    }
}
const getDataById = async (req: Request, res: Response) => {
    const { id } = req.params
    console.log(id);
    try {
        const result = await adminService.getDataById(id)
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
const updateIntoDb = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const result = await adminService.updateIntoDb(id, req.body)
        res.status(200).json({
            success: true,
            massage: "Admin updated successfully.",
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


const deleteFromDb = async (req: Request, res: Response) => {
    const { id } = req.params
    try {
        const result = await adminService.deleteFromDb(id)
        res.status(200).json({
            success: true,
            massage: "Admin deleted successfully.",
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
    getAllAdminData,
    getDataById,
    updateIntoDb,
    deleteFromDb
}