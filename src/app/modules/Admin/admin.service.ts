

import { Prisma, PrismaClient } from "../../../generated/prisma";
import { adminSearchableFields } from "./admin.constant";
const prisma = new PrismaClient()

const calculatePagination = (options: {
    page?: number,
    limit?: number,
    sortOrder?: string,
    sortBy?: string
}) => {
    const page: number = Number(options.page) || 1
    const limit: number = Number(options.limit) || 10
    const skip: number = (Number(page) - 1) * limit

    const sortBy: string = options.sortBy || 'createdAt'
    const sortOrder: string = options.sortOrder || 'desc'

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}

const getAllAdminData = async (params: any, options: any) => {
    const { limit, page, skip } = calculatePagination(options)
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
    return result
}

export const adminService = {
    getAllAdminData
}