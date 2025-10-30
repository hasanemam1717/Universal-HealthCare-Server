import httpStatus from 'http-status';
import { PaymentStatus, UserRole } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import { IAuthUser } from "../../interfaces/common";
import prisma from '../../../shared/prisma';

const getMetaForDashBoard = async (user: IAuthUser) => {
    let metadata;
    switch (user?.role) {
        case UserRole.SUPER_ADMIN:
            metadata = getSuperAdminMetaData();
            break;
        case UserRole.ADMIN:
            metadata = getAdminMetaData();
            break;
        case UserRole.DOCTOR:
            metadata = getDoctorMetaData(user);
            break;
        case UserRole.PATIENT:
            metadata = getPatientMetaData(user);
            break;

        default: throw new ApiError(httpStatus.BAD_REQUEST, "Invalid role for your request...!")

    }

    return metadata
}

const getSuperAdminMetaData = async () => {
    const appointmentCount = await prisma.appointment.count()
    const patientCount = await prisma.patient.count()
    const paymentCount = await prisma.payment.count()
    const doctorCount = await prisma.doctor.count()
    const adminCount = await prisma.admin.count()
    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    })
    const barChartData = await getBarChartData()
    const pieChartData = await getPieChartData()
    return { adminCount, appointmentCount, patientCount, paymentCount, doctorCount, totalRevenue: totalRevenue._sum, barChartData, pieChartData }
}
const getAdminMetaData = async () => {
    const appointmentCount = await prisma.appointment.count()
    const patientCount = await prisma.patient.count()
    const paymentCount = await prisma.payment.count()
    const doctorCount = await prisma.doctor.count()
    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    })

    const barChartData = await getBarChartData()
    const pieChartData = await getPieChartData()

    return { appointmentCount, patientCount, paymentCount, doctorCount, totalRevenue, barChartData, pieChartData }
}
const getDoctorMetaData = async (user: IAuthUser) => {
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
    const doctorAppointmentCount = await prisma.appointment.count({
        where: {
            doctorId: doctorInfo.id
        }
    })
    const doctorPatientCount = await prisma.appointment.groupBy({
        by: ['patientId'],
        _count: {
            id: true
        }
    })
    const reviewCount = await prisma.review.count({
        where: {
            doctorId: doctorInfo.id
        }
    })
    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appointment: {
                doctorId: doctorInfo.id
            }
        }
    })
    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: { doctorId: doctorInfo.id }
    })
    const formatAppointment = appointmentStatusDistribution.map((count) => ({
        status: count.status,
        count: Number(count._count.id)
    }))
    return { doctorAppointmentCount, doctorPatientCount: doctorPatientCount.length, reviewCount, totalRevenue: totalRevenue._sum, formatAppointment }
}
const getPatientMetaData = async (user: IAuthUser) => {
    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
    const patientAppointmentCount = await prisma.appointment.count({
        where: {
            patientId: patientInfo.id
        }
    })
    const prescriptionCount = await prisma.prescription.count({
        where: {
            patientId: patientInfo.id
        }
    })
    const reviewCount = await prisma.review.count({
        where: {
            patientId: patientInfo.id
        }
    })

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: { patientId: patientInfo.id }
    })
    const formatAppointment = appointmentStatusDistribution.map((count) => ({
        status: count.status,
        count: Number(count._count.id)
    }))
    return { patientAppointmentCount, prescriptionCount, reviewCount, formatAppointment }
}

const getBarChartData = async () => {
    const appointmentCountByMonth = await prisma.$queryRawUnsafe(`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
           COUNT(*)::int AS count
    FROM "appointments"
    GROUP BY month
    ORDER BY month ASC;
  `);

    return appointmentCountByMonth
};

const getPieChartData = async () => {
    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        _count: { id: true }
    })
    const formatAppointment = appointmentStatusDistribution.map((count) => ({
        status: count.status,
        count: Number(count._count.id)
    }))

    return formatAppointment
}


export const metaService = {
    getMetaForDashBoard
}