import { Admin, Doctor, Patient, Prisma, UserRole, UserStatus } from "@prisma/client";
import bcrypt from 'bcrypt'
import prisma from "../../../shared/prisma";
import { fileUploader } from "../../../helpers/fileUploaders";
import { Request } from "express";
import { IFile } from "../../interfaces/file";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constance";
import { IAuthUser } from "../../interfaces/common";

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
            total,
            page: Number(page),
            limit: Number(limit),
        },
        data: result,
    };
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
const getMyProfile = async (user: IAuthUser) => {
    console.log(user);
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            needPasswordChange: true,
            status: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    })
    let profileInfo;
    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        })
    }
    return { ...userInfo, ...profileInfo }
}

const updateMyProfile = async (user: IAuthUser, req: Request) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        }
    })
    const file = req.file as IFile
    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file)
        req.body.profilePhoto = uploadToCloudinary?.secure_url
    }
    let profileInfo;
    if (userInfo.role === UserRole.SUPER_ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.ADMIN) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.DOCTOR) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    else if (userInfo.role === UserRole.PATIENT) {
        profileInfo = await prisma.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        })
    }
    return { ...profileInfo }

}


export const userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDb,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
}