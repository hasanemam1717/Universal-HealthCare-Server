
import { jwtHelpers } from "../../../helpers/jwtTokenGenaretor"
import prisma from "../../../shared/prisma"
import bcrypt from "bcrypt"




const logInUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email
        }
    })

    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password)
    if (!isCorrectPassword) {
        throw new Error("Password incorrect.")
    }
    const accessToken = jwtHelpers.generateToken({ email: userData.email, role: userData.role }, 'abcdef', "3m")
    const refreshToken = jwtHelpers.generateToken({ email: userData.email, role: userData.role }, 'abcde', "30d")
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    }
}



export const authService = {
    logInUser
}