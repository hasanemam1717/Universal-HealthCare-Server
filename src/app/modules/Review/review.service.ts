import httpStatus from 'http-status';
import { Review } from "../../../generated/prisma";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common"

const insertIntoDb = async (user: IAuthUser, payload: any) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })


    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId
        }
    })
    if (!(patientData.id === appointmentData.patientId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment.")
    }
    return await prisma.$transaction(async (tx) => {
        const result = await tx.review.create({
            data: {
                appointmentId: payload.appointmentId,
                rating: payload.rating as number,
                comment: payload.comment as string,
                patientId: appointmentData.patientId,
                doctorId: appointmentData.doctorId

            }
        })
        const avgRating = await tx.review.aggregate({
            _avg: {
                rating: true
            }
        })
        await tx.doctor.update({
            where: {
                id: result.doctorId
            },
            data: {
                averageRating: avgRating._avg.rating as number
            }
        })
    })
}

export const reviewService = { insertIntoDb }