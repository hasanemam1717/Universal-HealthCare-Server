"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const uuid_1 = require("uuid");
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_2 = require("./../../../generated/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const createAppointment = async (user, payload) => {
    const patientData = await prisma_1.default.patient.findUniqueOrThrow({
        where: {
            email: user?.email
        }
    });
    const doctorData = await prisma_1.default.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId
        }
    });
    await prisma_1.default.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorData.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    });
    const videoCallingId = (0, uuid_1.v4)();
    const result = await prisma_1.default.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                patientId: patientData.id,
                doctorId: doctorData.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            },
            include: {
                patient: true,
                doctor: true,
                schedule: true
            }
        });
        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorData.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: appointmentData.id
            }
        });
        // Universal-HealthCare-datatime
        const today = new Date();
        const transactionId = "PH-HealthCare-" + today.getFullYear() + "-" + today.getMonth() + "-" + today.getDay() + "-" + today.getHours() + "-" + today.getMinutes();
        await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorData.appointmentFee,
                transactionId
            }
        });
        return appointmentData;
    });
    return result;
};
const getMyAppointment = async (user, filters, options) => {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { ...filterData } = filters;
    const andConditions = [];
    if (user?.role === prisma_2.UserRole.PATIENT) {
        andConditions.push({
            patient: {
                email: user?.email
            }
        });
    }
    else if (user?.role === prisma_2.UserRole.DOCTOR) {
        andConditions.push({
            doctor: {
                email: user?.email
            }
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
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: user?.role === prisma_2.UserRole.PATIENT
            ? { doctor: true, schedule: true } : { patient: { include: { medicalReport: true, patientHealthData: true } }, schedule: true }
    });
    const total = await prisma_1.default.appointment.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page,
            limit,
        },
        data: result,
    };
};
const getAllFromDB = async (filters, options) => {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const { patientEmail, doctorEmail, ...filterData } = filters;
    const andConditions = [];
    if (patientEmail) {
        andConditions.push({
            patient: {
                email: patientEmail
            }
        });
    }
    else if (doctorEmail) {
        andConditions.push({
            doctor: {
                email: doctorEmail
            }
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => {
                return {
                    [key]: {
                        equals: filterData[key]
                    }
                };
            })
        });
    }
    // console.dir(andConditions, { depth: Infinity })
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const result = await prisma_1.default.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : {
                createdAt: 'desc',
            },
        include: {
            doctor: true,
            patient: true
        }
    });
    const total = await prisma_1.default.appointment.count({
        where: whereConditions
    });
    return {
        meta: {
            total,
            page: page ?? 1,
            limit: limit ?? 10,
        },
        data: result,
    };
};
const changeAppointmentStatus = async (appointmentId, status, user) => {
    const appointmentData = await prisma_1.default.appointment.findUniqueOrThrow({
        where: {
            id: appointmentId
        },
        include: {
            doctor: true
        }
    });
    if (user?.role === prisma_2.UserRole.DOCTOR) {
        if (!(user.email === appointmentData.doctor.email)) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "This is not your appointment.");
        }
    }
    const result = await prisma_1.default.appointment.update({
        where: {
            id: appointmentId
        },
        data: {
            status
        }
    });
    console.log(appointmentId, status);
};
const cancelUnpaidAppointments = async () => {
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const unpaidAppointments = await prisma_1.default.appointment.findMany({
        where: {
            createdAt: {
                lte: thirtyMinutesAgo
            },
            paymentStatus: prisma_2.PaymentStatus.UNPAID
        }
    });
    const appointmentIdsToCancel = unpaidAppointments.map(appoint => appoint.id);
    console.log(appointmentIdsToCancel);
    await prisma_1.default.$transaction(async (tx) => {
        await tx.payment.deleteMany({
            where: {
                appointmentId: {
                    in: appointmentIdsToCancel
                }
            }
        });
        await tx.appointment.deleteMany({
            where: {
                id: {
                    in: appointmentIdsToCancel
                }
            }
        });
        for (const unpaidAppointment of unpaidAppointments) {
            await tx.doctorSchedules.updateMany({
                where: {
                    doctorId: unpaidAppointment.doctorId,
                    scheduleId: unpaidAppointment.scheduleId
                },
                data: {
                    isBooked: false
                }
            });
        }
    });
};
exports.AppointmentService = {
    createAppointment,
    getMyAppointment,
    getAllFromDB,
    changeAppointmentStatus,
    cancelUnpaidAppointments
};
