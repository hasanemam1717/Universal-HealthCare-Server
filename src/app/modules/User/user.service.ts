import { PrismaClient, UserRole } from "../../../generated/prisma";
import bcrypt from 'bcrypt'
const prisma = new PrismaClient()

const createAdmin = async (data: any) => {

    const hashPassword: string = await bcrypt.hash(data.password, 12)

    const userData = {
        email: data.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN

    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const createUserData = await transactionClient.user.create({
            data: userData
        })
        const createAdminData = await transactionClient.admin.create({
            data: data.admin
        })

        return createAdminData
    })
    return result
}



export const userService = {
    createAdmin
}