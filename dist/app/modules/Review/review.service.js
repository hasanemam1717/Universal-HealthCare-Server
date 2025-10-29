"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const insertIntoDb = async (user, payload) => {
    const patientData = await prisma_1.default.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const appointmentData = await prisma_1.default.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        }
    });
    if (!(patientData.id === appointmentData.patientId)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "This is not your appointment.");
    }
    return await prisma_1.default.$transaction(async (tx) => {
        const result = await tx.review.create({
            data: {
                appointmentId: payload.appointmentId,
                rating: payload.rating,
                comment: payload.comment,
                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId
            }
        });
        const avgRating = await tx.review.aggregate({
            _avg: {
                rating: true
            }
        });
        await tx.doctor.update({
            where: {
                id: result.doctorId
            },
            data: {
                averageRating: avgRating._avg.rating
            }
        });
    });
};
exports.reviewService = { insertIntoDb };
