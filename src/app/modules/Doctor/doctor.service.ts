

import { Doctor, Prisma, UserStatus } from "../../../generated/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { doctorSearchableFields } from "./doctor.constant";
import { IDoctorFilterRequest } from "./doctor.interface";



const getAllDoctorData = async (params: IDoctorFilterRequest, options: IPaginationOptions) => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options)
    const addConditions: Prisma.DoctorWhereInput[] = []

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
    addConditions.push({
        isDeleted: false
    })

    // search functionality complex and advanced
    if (params?.searchTerm) {
        addConditions.push({
            OR: doctorSearchableFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    // console.dir(addConditions, { depth: "infinity" });

    const whereCondition: Prisma.DoctorWhereInput = { AND: addConditions }

    const result = await prisma.doctor.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    })
    const total = await prisma.doctor.count({
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
const getDataById = async (id: string): Promise<Doctor | null> => {
    const result = await prisma.doctor.findUnique({
        where: {
            id,
            isDeleted: false
        }
    })

    return result
}

// const updateIntoDb = async (id: string, data: Partial<Admin>): Promise<Admin | null> => {
//     await prisma.admin.findUniqueOrThrow({
//         where: {
//             id,
//             isDeleted: false

//         }
//     })
//     const result = await prisma.admin.update({
//         where: {
//             id

//         },
//         data
//     })

//     return result
// }

const deleteFromDb = async (id: string) => {

    await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    })
    const result = await prisma.$transaction(async (transactionClient) => {
        const doctorDeletedData = await transactionClient.doctor.delete({
            where: {
                id
            }
        })
        await transactionClient.user.delete({
            where: {
                email: doctorDeletedData.email
            }
        })

        return doctorDeletedData

    })
}
const softDeleteFromDb = async (id: string) => {

    await prisma.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })
    const result = await prisma.$transaction(async (transactionClient) => {
        const doctorDeletedData = await transactionClient.doctor.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        })
        await transactionClient.user.update({
            where: {
                email: doctorDeletedData.email
            },
            data: {
                status: UserStatus.DELETED
            }
        })

        return doctorDeletedData

    })
}

export const doctorService = {
    getAllDoctorData,
    getDataById,
    deleteFromDb,
    softDeleteFromDb
}