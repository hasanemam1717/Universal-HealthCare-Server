"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatientService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const patient_constant_1 = require("./patient.constant");
const index_d_1 = require("./../../../generated/prisma/index.d");
const getAllFromDB = async (filters, options) => {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { searchTerm, ...filterData } = filters;
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            OR: patient_constant_1.patientSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                return {
                    [key]: {
                        equals: filterData[key],
                    },
                };
            }),
        });
    }
    andConditions.push({
        isDeleted: false,
    });
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.patient.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
        include: {
            medicalReport: true,
            patientHealthData: true,
        }
    });
    const total = await prisma_1.default.patient.count({
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
const getByIdFromDB = async (id) => {
    const result = await prisma_1.default.patient.findUnique({
        where: {
            id,
            isDeleted: false,
        },
        include: {
            medicalReport: true,
            patientHealthData: true,
        },
    });
    return result;
};
const updateIntoDB = async (id, payload) => {
    const { patientHealthData, medicalReport, ...patientData } = payload;
    const patientInfo = await prisma_1.default.patient.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    });
    await prisma_1.default.$transaction(async (transactionClient) => {
        //update patient data
        await transactionClient.patient.update({
            where: {
                id
            },
            data: patientData,
            include: {
                patientHealthData: true,
                medicalReport: true
            }
        });
        // create or update patient health data
        if (patientHealthData) {
            await transactionClient.patientHealthData.upsert({
                where: {
                    patientId: patientInfo.id
                },
                update: patientHealthData,
                create: { ...patientHealthData, patientId: patientInfo.id }
            });
        }
        ;
        if (medicalReport) {
            await transactionClient.medicalReport.create({
                data: { ...medicalReport, patientId: patientInfo.id }
            });
        }
    });
    const responseData = await prisma_1.default.patient.findUnique({
        where: {
            id: patientInfo.id
        },
        include: {
            patientHealthData: true,
            medicalReport: true
        }
    });
    return responseData;
};
const deleteFromDB = async (id) => {
    const result = await prisma_1.default.$transaction(async (tx) => {
        // delete medical report
        await tx.medicalReport.deleteMany({
            where: {
                patientId: id
            }
        });
        // delete patient health data
        await tx.patientHealthData.delete({
            where: {
                patientId: id
            }
        });
        const deletedPatient = await tx.patient.delete({
            where: {
                id
            }
        });
        await tx.user.delete({
            where: {
                email: deletedPatient.email
            }
        });
        return deletedPatient;
    });
    return result;
};
const softDelete = async (id) => {
    return await prisma_1.default.$transaction(async (transactionClient) => {
        const deletedPatient = await transactionClient.patient.update({
            where: { id },
            data: {
                isDeleted: true,
            },
        });
        await transactionClient.user.update({
            where: {
                email: deletedPatient.email,
            },
            data: {
                status: index_d_1.UserStatus.DELETED,
            },
        });
        return deletedPatient;
    });
};
exports.PatientService = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDelete,
};
