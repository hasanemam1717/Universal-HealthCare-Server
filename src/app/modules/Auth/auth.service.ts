
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



export const authService = {
    logInUser,
    refreshToken
}