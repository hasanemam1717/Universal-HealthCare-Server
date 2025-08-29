import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploaders";
import prisma from "../../../shared/prisma";

const insertIntoDb = async (req: Request) => {
    const file = req.file
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.icon = uploadToCloudinary?.secure_url
    }
    const result = await prisma.specialties.create({
        data: req.body
    })
    return result
}

export const specialtiesService = {
    insertIntoDb
}