import { Prisma, PrismaClient } from "../../../generated/prisma";
const prisma = new PrismaClient()

const getAllAdminData = async (params: any) => {
    const addConditions: Prisma.AdminWhereInput[] = []
    if (params?.searchTerm) {
        addConditions.push({
            OR: [
                {
                    name: {
                        contains: params.searchTerm,
                        mode: "insensitive"
                    }
                },
                {
                    email: {
                        contains: params.searchTerm,
                        mode: "insensitive"
                    }
                }
            ]
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