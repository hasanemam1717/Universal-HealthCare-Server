"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const prisma_1 = require("../../../generated/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_2 = __importDefault(require("../../../shared/prisma"));
const fileUploaders_1 = require("../../../helpers/fileUploaders");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const user_constance_1 = require("./user.constance");
const createAdmin = async (req) => {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploaders_1.fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
        // console.log("ups", uploadToCloudinary);
    }
    const hashPassword = await bcrypt_1.default.hash(req.body.password, 12);
    const userData = {
        email: req.body.admin.email,
        password: hashPassword,
        role: prisma_1.UserRole.ADMIN
    };
    const result = await prisma_2.default.$transaction(async (transactionClient) => {
        const createUserData = await transactionClient.user.create({
            data: userData
        });
        const createAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });
        return createAdminData;
    });
    return result;
};
const createDoctor = async (req) => {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploaders_1.fileUploader.uploadToCloudinary(file);
        req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
    }
    const hashedPassword = await bcrypt_1.default.hash(req.body.password, 12);
    const userData = {
        email: req.body.doctor.email,
        password: hashedPassword,
        role: prisma_1.UserRole.DOCTOR
    };
    const result = await prisma_2.default.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });
        const createdDoctorData = await transactionClient.doctor.create({
            data: req.body.doctor
        });
        return createdDoctorData;
    });
    return result;
};
const createPatient = async (req) => {
    const file = req.file;
    if (file) {
        const uploadedProfileImage = await fileUploaders_1.fileUploader.uploadToCloudinary(file);
        req.body.patient.profilePhoto = uploadedProfileImage?.secure_url;
    }
    const hashedPassword = await bcrypt_1.default.hash(req.body.password, 12);
    const userData = {
        email: req.body.patient.email,
        password: hashedPassword,
        role: prisma_1.UserRole.PATIENT
    };
    const result = await prisma_2.default.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });
        const createdPatientData = await transactionClient.patient.create({
            data: req.body.patient
        });
        return createdPatientData;
    });
    return result;
};
const getAllUserFromDb = async (params, options) => {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const addConditions = [];
    const { searchTerm, ...filterData } = params;
    // search functionality complex and advanced
    if (Object.keys(filterData).length) {
        addConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: filterData[key]
                }
            }))
        });
    }
    // search functionality complex and advanced
    if (params?.searchTerm) {
        addConditions.push({
            OR: user_constance_1.userSearchableFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }
    // console.dir(addConditions, { depth: "infinity" });
    const whereCondition = addConditions.length > 0 ? { AND: addConditions } : {};
    const result = await prisma_2.default.user.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }, select: {
            id: true,
            email: true,
            role: true,
            status: true,
            needPasswordChange: true,
            createdAt: true,
            updatedAt: true
        }
    });
    const total = await prisma_2.default.user.count({
        where: whereCondition
    });
    return {
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
        },
        data: result,
    };
};
const changeProfileStatus = async (id, status) => {
    const userData = await prisma_2.default.user.findUniqueOrThrow({
        where: {
            id
        }
    });
    const updateUserStatus = await prisma_2.default.user.update({
        where: {
            id
        },
        data: status
    });
    return updateUserStatus;
};
const getMyProfile = async (user) => {
    console.log(user);
    const userInfo = await prisma_2.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: prisma_1.UserStatus.ACTIVE
        },
        select: {
            id: true,
            needPasswordChange: true,
            status: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    let profileInfo;
    if (userInfo.role === prisma_1.UserRole.SUPER_ADMIN) {
        profileInfo = await prisma_2.default.admin.findUnique({
            where: {
                email: userInfo.email
            }
        });
    }
    else if (userInfo.role === prisma_1.UserRole.ADMIN) {
        profileInfo = await prisma_2.default.admin.findUnique({
            where: {
                email: userInfo.email
            }
        });
    }
    else if (userInfo.role === prisma_1.UserRole.DOCTOR) {
        profileInfo = await prisma_2.default.admin.findUnique({
            where: {
                email: userInfo.email
            }
        });
    }
    else if (userInfo.role === prisma_1.UserRole.PATIENT) {
        profileInfo = await prisma_2.default.admin.findUnique({
            where: {
                email: userInfo.email
            }
        });
    }
    return { ...userInfo, ...profileInfo };
};
const updateMyProfile = async (user, req) => {
    const userInfo = await prisma_2.default.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: prisma_1.UserStatus.ACTIVE
        }
    });
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploaders_1.fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary?.secure_url;
    }
    let profileInfo;
    if (userInfo.role === prisma_1.UserRole.SUPER_ADMIN) {
        profileInfo = await prisma_2.default.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    else if (userInfo.role === prisma_1.UserRole.ADMIN) {
        profileInfo = await prisma_2.default.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    else if (userInfo.role === prisma_1.UserRole.DOCTOR) {
        profileInfo = await prisma_2.default.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    else if (userInfo.role === prisma_1.UserRole.PATIENT) {
        profileInfo = await prisma_2.default.admin.update({
            where: {
                email: userInfo.email
            },
            data: req.body
        });
    }
    return { ...profileInfo };
};
exports.userService = {
    createAdmin,
    createDoctor,
    createPatient,
    getAllUserFromDb,
    changeProfileStatus,
    getMyProfile,
    updateMyProfile
};
