"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doctorService = void 0;
const prisma_1 = require("./../../../generated/prisma");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_2 = __importDefault(require("../../../shared/prisma"));
const doctor_constant_1 = require("./doctor.constant");
const getAllDoctorData = async (filters, options) => {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, specialties, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: doctor_constant_1.doctorSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (specialties && specialties.length > 0) {
        // Corrected specialties condition
        andConditions.push({
            doctorSpecialties: {
                some: {
                    specialties: {
                        title: {
                            contains: specialties,
                            mode: 'insensitive',
                        },
                    },
                },
            },
        });
    }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: filterData[key],
            },
        }));
        andConditions.push(...filterConditions);
    }
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_2.default.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { averageRating: 'asc' },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        },
    });
    const total = await prisma_2.default.doctor.count({
        where: whereConditions,
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
    const result = await prisma_2.default.doctor.findUnique({
        where: {
            id,
            isDeleted: false
        }
    });
    return result;
};
const updateIntoDb = async (id, payload) => {
    const { specialties, ...doctorData } = payload;
    const doctorInfo = await prisma_2.default.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });
    await prisma_2.default.$transaction(async (transactionClient) => {
        await transactionClient.doctor.update({
            where: {
                id
            },
            data: doctorData
        });
        if (specialties && specialties.length > 0) {
            // delete specialties
            const deleteSpecialtiesIds = specialties.filter((specialty) => specialty.isDeleted);
            //console.log(deleteSpecialtiesIds)
            for (const specialty of deleteSpecialtiesIds) {
                await transactionClient.doctorSpecialties.deleteMany({
                    where: {
                        doctorId: doctorInfo.id,
                        specialtiesId: specialty.specialtiesId
                    }
                });
            }
            // create specialties
            const createSpecialtiesIds = specialties.filter((specialty) => !specialty.isDeleted);
            console.log(createSpecialtiesIds);
            for (const specialty of createSpecialtiesIds) {
                await transactionClient.doctorSpecialties.create({
                    data: {
                        doctorId: doctorInfo.id,
                        specialtiesId: specialty.specialtiesId
                    }
                });
            }
        }
    });
    const result = await prisma_2.default.doctor.findUnique({
        where: {
            id: doctorInfo.id
        },
        include: {
            doctorSpecialties: {
                include: {
                    specialties: true
                }
            }
        }
    });
    return result;
};
const deleteFromDb = async (id) => {
    await prisma_2.default.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });
    const result = await prisma_2.default.$transaction(async (transactionClient) => {
        const doctorDeletedData = await transactionClient.doctor.delete({
            where: {
                id
            }
        });
        await transactionClient.user.delete({
            where: {
                email: doctorDeletedData.email
            }
        });
        return doctorDeletedData;
    });
};
const softDeleteFromDb = async (id) => {
    await prisma_2.default.doctor.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    const result = await prisma_2.default.$transaction(async (transactionClient) => {
        const doctorDeletedData = await transactionClient.doctor.update({
            where: {
                id
            },
            data: {
                isDeleted: true
            }
        });
        await transactionClient.user.update({
            where: {
                email: doctorDeletedData.email
            },
            data: {
                status: prisma_1.UserStatus.DELETED
            }
        });
        return doctorDeletedData;
    });
};
exports.doctorService = {
    getAllDoctorData,
    getDataById,
    updateIntoDb,
    deleteFromDb,
    softDeleteFromDb
};
