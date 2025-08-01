import prisma from "../../../shared/prisma"
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'

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
    const accessToken = jwt.sign({
        email: userData.email,
        role: userData.role
    }, "abcd", { algorithm: "HS256", expiresIn: "5m" })
    const refreshToken = jwt.sign({
        email: userData.email,
        role: userData.role
    }, "abcdef", { algorithm: "HS256", expiresIn: "30d" })
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    }
}



export const authService = {
    logInUser
}