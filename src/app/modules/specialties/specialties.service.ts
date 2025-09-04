import { Request, Response } from "express";
import { fileUploader } from "../../../helpers/fileUploaders";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";

const insertIntoDb = async (req: Request) => {
    const file = req.file as IFile
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.icon = uploadToCloudinary?.secure_url
    }
    const result = await prisma.specialties.create({
        data: req.body
    })
    return result
}
const getAllSpecialtiesFromDb = async (req: Request, res: Response) => {
    const result = await prisma.specialties.findMany()
    return result
}


const hardDeleteSpecialties = async (req: Request, res: Response) => {
    const result = await prisma.specialties.delete({
        where: {
            id: req.params.id
        }
    })
    return result
}

export const specialtiesService = {
    insertIntoDb,
    getAllSpecialtiesFromDb,
    hardDeleteSpecialties
}