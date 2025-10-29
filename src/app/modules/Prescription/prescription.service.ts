import httpStatus from 'http-status';
import { AppointmentStatus, PaymentStatus, Prescription } from "../../../generated/prisma";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";

const insertIntoDb = async (user: IAuthUser, payload: Partial<Prescription>) => {
    const appointmentData = await prisma.appointment.findUniqueOrThrow({
        where: {
            id: payload.appointmentId,
            status: AppointmentStatus.COMPLETED,
            paymentStatus: PaymentStatus.PAID
        },
        include: {
            doctor: true
        }
    })

    if (!(user?.email === appointmentData.doctor.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "This is not your appointment")
    }
    const result = await prisma.prescription.create({
        data: {
            appointmentId: appointmentData.id,
            doctorId: appointmentData.doctor.id,
            patientId: appointmentData.patientId,
            instructions: payload.instructions as string,
            followUpDate: payload.followUpDate || null || undefined
        },
        include: {
            patient: true
        }
    })
    return result
}

export const prescriptionService = { insertIntoDb }