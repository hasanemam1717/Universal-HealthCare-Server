import { PrismaClient } from "../../../generated/prisma";
const prisma = new PrismaClient()

const getAllAdminData = async (params: any) => {
    console.log(params);

    const result = await prisma.admin.findMany({
        where: {
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
        }
    })
    return result
}



export const adminService = {
    getAllAdminData
}