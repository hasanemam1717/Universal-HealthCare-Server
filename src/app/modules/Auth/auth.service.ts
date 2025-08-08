

import { jwtHelpers } from "../../../helpers/jwtTokenGenaretor"
import prisma from "../../../shared/prisma"
import bcrypt from "bcrypt"
import config from "../../../config"
import { Secret } from "jsonwebtoken"
import ApiErrors from "../../errors/ApiError"
import status from "http-status"
import { UserStatus } from "../../../generated/prisma"
import emailSender from "./emailSender"
import ApiError from "../../errors/ApiError"




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

const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const resetPassToken = jwtHelpers.generateToken(
        { email: userData.email, role: userData.role },
        config.jwt.jwt_secret_reset_password as string,
        config.jwt.jwt_expire_in as string
    )
    //console.log(resetPassToken)

    const resetPassLink = config.reset_password_link + `?userId=${userData.id}&token=${resetPassToken}`

    await emailSender(
        userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
    )
    //console.log(resetPassLink)
};
const resetPassword = async (token: string, payload: { id: string, password: string }) => {
    console.log({ token, payload })

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isValidToken = jwtHelpers.verifyToken(token, config.jwt.jwt_secret_reset_password as Secret)

    if (!isValidToken) {
        throw new ApiError(status.FORBIDDEN, "Forbidden!")
    }

    // hash password
    const password = await bcrypt.hash(payload.password, 12);

    // update into database
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    })
};


export const authService = {
    logInUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}