"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prescriptionService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../../generated/prisma");
const prisma_2 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const insertIntoDb = async (user, payload) => {
    const appointmentData = await prisma_2.default.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: prisma_1.AppointmentStatus.COMPLETED,
            paymentStatus: prisma_1.PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    });
    if (!(user?.email === appointmentData.doctor.email)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "This is not your appointment");
    }
    const result = await prisma_2.default.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctor.id,
            patientId: appointmentData.patientId,
            instructions: payload.instructions,
            followUpDate: payload.followUpDate || null || undefined
        },
        include: {
            patient: true
        }
    });
    return result;
};
const getPatientPrescription = async (user, options) => {
    const { limit, page, skip } = paginationHelper_1.paginationHelpers.calculatePagination(options);
    const result = await prisma_2.default.prescription.findMany({
        where: {
            patient: {
                email: user.email
            }
        },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? { [options.sortBy]: options.sortBy } : { createdAt: 'desc' },
        include: {
            doctor: true,
            patient: true,
            appointment: true
        }
    });
    const total = await prisma_2.default.prescription.count({
        where: {
            patient: {
                email: user.email
            }
        }
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
exports.prescriptionService = { insertIntoDb, getPatientPrescription };
