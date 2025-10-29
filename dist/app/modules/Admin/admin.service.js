"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminService = void 0;
const prisma_1 = require("../../../generated/prisma");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_2 = __importDefault(require("../../../shared/prisma"));
const admin_constant_1 = require("./admin.constant");
const getAllAdminData = async (params, options) => {
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
    addConditions.push({
        isDeleted: false
    });
    // search functionality complex and advanced
    if (params?.searchTerm) {
        addConditions.push({
            OR: admin_constant_1.adminSearchableFields.map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }
    // console.dir(addConditions, { depth: "infinity" });
    const whereCondition = { AND: addConditions };
    const result = await prisma_2.default.admin.findMany({
        where: whereCondition,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });
    const total = await prisma_2.default.admin.count({
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
const getDataById = async (id) => {
    const result = await prisma_2.default.admin.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    return result;
};
const updateIntoDb = async (id, data) => {
    await prisma_2.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = await prisma_2.default.admin.update({
        where: {
            id
        },
        data
    });
    return result;
};
const deleteFromDb = async (id) => {
    await prisma_2.default.admin.findUniqueOrThrow({
        where: {
            id
        }
    });
    const result = await prisma_2.default.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.delete({
            where: {
                id
            }
        });
        await transactionClient.user.delete({
            where: {
                email: adminDeletedData.email
            }
        });
        return adminDeletedData;
    });
};
const softDeleteFromDb = async (id) => {
    await prisma_2.default.admin.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = await prisma_2.default.$transaction(async (transactionClient) => {
        const adminDeletedData = await transactionClient.admin.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        await transactionClient.user.update({
            where: {
                email: adminDeletedData.email
            },
            data: {
                status: prisma_1.UserStatus.DELETED
            }
        });
        return adminDeletedData;
    });
};
exports.adminService = {
    getAllAdminData,
    getDataById,
    updateIntoDb,
    deleteFromDb,
    softDeleteFromDb
};
