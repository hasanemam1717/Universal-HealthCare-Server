"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const jwtTokenGenaretor_1 = require("../../../helpers/jwtTokenGenaretor");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const prisma_2 = require("../../../generated/prisma");
const emailSender_1 = __importDefault(require("./emailSender"));
const ApiError_2 = __importDefault(require("../../errors/ApiError"));
const logInUser = async (payload) => {
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email
        }
    });
    const isCorrectPassword = await bcrypt_1.default.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect.");
    }
    const accessToken = jwtTokenGenaretor_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt.jwt_secret, config_1.default.jwt.jwt_expire_in);
    const refreshToken = jwtTokenGenaretor_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt.jwt_refresh_token, config_1.default.jwt.jwt_refresh_expire_in);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
};
const refreshToken = async (token) => {
    // console.log(token, "JWT");
    let decodedData;
    try {
        decodedData = jwtTokenGenaretor_1.jwtHelpers.verifyToken(token, config_1.default.jwt.jwt_refresh_token);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
    }
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: prisma_2.UserStatus.ACTIVE
        }
    });
    return userData;
};
const changePassword = async (user, payload) => {
    const userData = await prisma_1.default.user.findFirstOrThrow({
        where: {
            email: user.email,
            status: prisma_2.UserStatus.ACTIVE
        }
    });
    const isCorrectPassword = await bcrypt_1.default.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect.");
    }
    const hashPassword = await bcrypt_1.default.hash(payload.newPassword, 12);
    await prisma_1.default.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashPassword,
            needPasswordChange: false
        }
    });
    return {
        message: "Password change successfully."
    };
};
const forgotPassword = async (payload) => {
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: prisma_2.UserStatus.ACTIVE
        }
    });
    const resetPassToken = jwtTokenGenaretor_1.jwtHelpers.generateToken({ email: userData.email, role: userData.role }, config_1.default.jwt.jwt_secret_reset_password, config_1.default.jwt.jwt_expire_in);
    //console.log(resetPassToken)
    const resetPassLink = config_1.default.reset_password_link + `?userId=${userData.id}&token=${resetPassToken}`;
    await (0, emailSender_1.default)(userData.email, `
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
        `);
    //console.log(resetPassLink)
};
const resetPassword = async (token, payload) => {
    console.log({ token, payload });
    const userData = await prisma_1.default.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: prisma_2.UserStatus.ACTIVE
        }
    });
    const isValidToken = jwtTokenGenaretor_1.jwtHelpers.verifyToken(token, config_1.default.jwt.jwt_secret_reset_password);
    if (!isValidToken) {
        throw new ApiError_2.default(http_status_1.default.FORBIDDEN, "Forbidden!");
    }
    // hash password
    const password = await bcrypt_1.default.hash(payload.password, 12);
    // update into database
    await prisma_1.default.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    });
};
exports.authService = {
    logInUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
};
