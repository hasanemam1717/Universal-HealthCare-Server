
import { jwtHelpers } from "../../../helpers/jwtTokenGenaretor"
import prisma from "../../../shared/prisma"
import bcrypt from "bcrypt"
import { UserStatus } from "../../../generated/prisma"
import config from "../../../config"
import { Secret } from "jsonwebtoken"
import ApiErrors from "../../errors/ApiError"
import status from "http-status"




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
    const accessToken = jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config.jwt.jwt_secret as string, config.jwt.jwt_expire_in)
    const refreshToken = jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config.jwt.jwt_refresh_token as string, config.jwt.jwt_refresh_expire_in)
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    }
}

const refreshToken = async (token: string) => {
    // console.log(token, "JWT");
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.jwt_refresh_token as Secret);
    }
    catch (err) {
        throw new ApiErrors(status.UNAUTHORIZED, "You are not authorized!")
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });
    return userData
}

const changePassword = async (user: any, payload: any) => {
    const userData = await prisma.user.findFirstOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    })
    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password)
    if (!isCorrectPassword) {
        throw new Error("Password incorrect.")
    }
    const hashPassword: string = await bcrypt.hash(payload.newPassword, 12)
    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password change successfully."
    }

}



export const authService = {
    logInUser,
    refreshToken,
    changePassword
}