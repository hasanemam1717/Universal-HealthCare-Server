

import { Admin, Prisma } from "../../../generated/prisma";
import { paginationHelpers } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { adminSearchableFields } from "./admin.constant";




const getAllAdminData = async (params: any, options: any) => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options)
    const addConditions: Prisma.AdminWhereInput[] = []

    const { searchTerm, ...filterData } = params

    // search functionality complex and advanced
    if (Object.keys(filterData).length) {
        addConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        })
    }

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
            [options.sortBy]: options.SortOrder
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
const getDataById = async (id: string) => {
    const result = await prisma.admin.findUnique({
        where: {
            id
        }
    })
    return result
}

const updateIntoDb = async (id: string, data: Partial<Admin>) => {
    await prisma.admin.findUniqueOrThrow({
        where: {
            id
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
    const result = await prisma.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.delete({
            where: {
                id
            }
        })
        const userDeletedData = await transactionClient.user.delete({
            where: {
                email: adminDeletedData.email
            }
        })

        return adminDeletedData

    })
}

export const adminService = {
    getAllAdminData,
    getDataById,
    updateIntoDb,
    deleteFromDb
}