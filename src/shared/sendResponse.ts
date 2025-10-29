import { Response } from "express"

const sendResponse = <T>(res: Response, jsonData: {
    statusCode: number,
    success: boolean,
    massage: string,
    meta?: {
        page: number,
        limit: number,
        total: number
    },
    data: T | null | undefined
}) => {
    res.status(jsonData.statusCode).json({
        success: jsonData.success,
        message: jsonData.massage,
        meta: jsonData.meta || null || undefined,
        data: jsonData.data || null || undefined
    })
}

export default sendResponse;