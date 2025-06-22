import { Prisma, PrismaClient } from "../../../generated/prisma";
import { adminSearchableFields } from "./admin.constant";
const prisma = new PrismaClient()

const getAllAdminData = async (params: any, options: any) => {
    const { limit, page } = options
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
        take: Number(limit)
    })
    return result
}



export const adminService = {
    getAllAdminData
}