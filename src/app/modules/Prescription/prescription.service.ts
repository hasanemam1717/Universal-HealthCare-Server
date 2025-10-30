import httpStatus from 'http-status';
import { AppointmentStatus, PaymentStatus, Prescription } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from '../../interfaces/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelper';

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

const getPatientPrescription = async (user: IAuthUser, options: IPaginationOptions) => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options)
    const result = await prisma.prescription.findMany({
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
    })
    const total = await prisma.prescription.count({
        where: {
            patient: {
                email: user.email
            }
        }
    })
    return {
        meta: {
            total,
            page: Number(page),
            limit: Number(limit),
        },
        data: result,
    };
}

export const prescriptionService = { insertIntoDb, getPatientPrescription }