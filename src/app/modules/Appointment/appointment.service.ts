import { Prisma, UserRole } from './../../../generated/prisma/index.d';
import { v4 as uuidv4 } from "uuid";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelpers } from "../../../helpers/paginationHelper";

const createAppointment = async (user: IAuthUser, payload: any) => {
    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId
        }
    })
    const doctorScheduleData = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorInfo.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    })

    const videoCallingId = uuidv4()
    const result = await prisma.$transaction(async (tx) => {
        const appointmentData = await tx.appointment.create({
            data: {
                patientId: patientInfo.id,
                doctorId: doctorInfo.id,
                scheduleId: payload.scheduleId,
                videoCallingId
            },
            include: {
                patient: true,
                doctor: true,
                schedule: true
            }
        })
        await tx.doctorSchedules.update({
            where: {
                doctorId_scheduleId: {
                    doctorId: doctorInfo.id,
                    scheduleId: payload.scheduleId
                }
            },
            data: {
                isBooked: true,
                appointmentId: appointmentData.id
            }
        })
        const today = new Date()
        const transactionId = "UNIVERSAL_HEALTH_CARE" + today.getFullYear() + "_" + today.getMonth() + "_" + today.getDay() + "_" + today.getHours() + "_" + today.getMinutes()
        await tx.payment.create({
            data: {
                appointmentId: appointmentData.id,
                amount: doctorInfo.appointmentFee,
                transactionId: transactionId
            }
        })
        return appointmentData
    })
    return result
}

const getMyAppointment = async (user: IAuthUser, filter: any, options: IPaginationOptions) => {
    const { limit, page, skip } = paginationHelpers.calculatePagination(options);
    const { ...filterData } = filter;
    const andConditions: Prisma.AppointmentWhereInput[] = [];
    // if (user?.role === UserRole.PATIENT) {
    //     andConditions.push({
    //         patient: {
    //             email: user.email
    //         }
    //     })
    // }
    // else if (user?.role === UserRole.DOCTOR) {
    //     andConditions.push({
    //         doctor: {
    //             email: user.email
    //         }
    //     })
    // }
    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map(key => ({
            [key]: {
                equals: (filterData as any)[key],
            },
        }));
        andConditions.push(...filterConditions);
    }

    const whereConditions: Prisma.AppointmentWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : {};

    const result = await prisma.appointment.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? { [options.sortBy]: options.sortOrder }
            : { createdAt: 'desc' },
        include: {
            doctor: true,
            schedule: true
        },
        // include: user?.role === UserRole.PATIENT ? { doctor: true, schedule: true } : { patient: { include: { medicalReport: true } }, schedule: true },
    });

    const total = await prisma.appointment.count({
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
}

export const appointmentService = {
    createAppointment,
    getMyAppointment
}