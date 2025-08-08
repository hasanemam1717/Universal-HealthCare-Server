import { Admin, Doctor, Patient, Prisma, UserRole } from "../../../generated/prisma";
import bcrypt from 'bcrypt'
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploaders";
import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constance";

const createAdmin = async (req: Request): Promise<Admin> => {

    const file = req.file as IFile
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
        // console.log("ups", uploadToCloudinary);

    }
    const hashPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN

    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const createUserData = await transactionClient.user.create({
            data: userData
        })
        const createAdminData = await transactionClient.admin.create({
            data: req.body.admin
        })

        return createAdminData
    })
    return result
}

const createDoctor = async (req: Request): Promise<Doctor> => {

    const file = req.file as IFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: UserRole.DOCTOR
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });

        return createdDoctorData;
    });

    return result;
};
const createPatient = async (req: Request): Promise<Patient> => {
    const file = req.file as IFile;

    if (file) {
        const uploadedProfileImage = await fileUploader.uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: UserRole.PATIENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient
        });

        return createdPatientData;
    });

    return result;
};

const getAllUserFromDb = async (params: any, options: IPaginationOptions) => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options)
    const addConditions: Prisma.UserWhereInput[] = []

    const { searchTerm, ...filterData } = params

    // search functionality complex and advanced
    if (Object.keys(filterData).length) {
        addConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        })
    }

    // search functionality complex and advanced
    if (params?.searchTerm) {
        addConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    // console.dir(addConditions, { depth: "infinity" });

    const whereCondition: Prisma.UserWhereInput = addConditions.length > 0 ? { AND: addConditions } : {}

    const result = await prisma.user.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }, select: {
            id: true,
            email: true,
            role: true,
            status: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true
        }
    })
    const total = await prisma.user.count({
        where: whereCondition
    })
    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    }
}
const changeProfileStatus = async (id: string, status: UserRole) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: status
    });

    return updateUserStatus;
}


export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDb,
    changeProfileStatus
}