

import { Admin, Prisma, UserStatus } from "../../../generated/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { adminSearchableFields } from "./admin.constant";
import { IAdminFilterRequest } from "./admin.interface";



const getAllAdminData = async (params: IAdminFilterRequest, options: IPaginationOptions) => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options)
    const addConditions: Prisma.AdminWhereInput[] = []

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
            OR: adminSearchableFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    // console.dir(addConditions, { depth: "infinity" });

    const whereCondition: Prisma.AdminWhereInput = { AND: addConditions }

    const result = await prisma.admin.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    })
    const total = await prisma.admin.count({
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
const getDataById = async (id: string): Promise<Admin | null> => {
    const result = await prisma.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    })
    return result
}

const updateIntoDb = async (id: string, data: Partial<Admin>): Promise<Admin | null> => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false

        }
    })
    const result = await prisma.admin.update({
        where: {
            id

        },
        data
    })

    return result
}

const deleteFromDb = async (id: string) => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id
        }
    })
    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.delete({
            where: {
                id
            }
        })
        await transactionClient.user.delete({
            where: {
                email: adminDeletedData.email
            }
        })

        return adminDeletedData

    })
}
const softDeleteFromDb = async (id: string) => {

    await prisma.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })
    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        })
        await transactionClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data: {
                status: UserStatus.DELETED
            }
        })

        return adminDeletedData

    })
}

export const adminService = {
    getAllAdminData,
    getDataById,
    updateIntoDb,
    deleteFromDb,
    softDeleteFromDb
}