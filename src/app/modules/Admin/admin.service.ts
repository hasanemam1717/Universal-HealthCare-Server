import { Prisma, PrismaClient } from "../../../generated/prisma";
const prisma = new PrismaClient()

const getAllAdminData = async (params: any) => {
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
            OR: ["name", "email"].map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }

    console.dir(addConditions, { depth: "infinity" });

    const whereCondition: Prisma.AdminWhereInput = { AND: addConditions }

    const result = await prisma.admin.findMany({
        where: whereCondition
    })
    return result
}



export const adminService = {
    getAllAdminData
}