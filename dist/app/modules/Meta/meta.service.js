"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.metaService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../../generated/prisma");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_2 = __importDefault(require("../../../shared/prisma"));
const getMetaForDashBoard = async (user) => {
    let metadata;
    switch (user?.role) {
        case prisma_1.UserRole.SUPER_ADMIN:
            metadata = getSuperAdminMetaData();
            break;
        case prisma_1.UserRole.ADMIN:
            metadata = getAdminMetaData();
            break;
        case prisma_1.UserRole.DOCTOR:
            metadata = getDoctorMetaData(user);
            break;
        case prisma_1.UserRole.PATIENT:
            metadata = getPatientMetaData(user);
            break;
        default: throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid role for your request...!");
    }
    return metadata;
};
const getSuperAdminMetaData = async () => {
    const appointmentCount = await prisma_2.default.appointment.count();
    const patientCount = await prisma_2.default.patient.count();
    const paymentCount = await prisma_2.default.payment.count();
    const doctorCount = await prisma_2.default.doctor.count();
    const adminCount = await prisma_2.default.admin.count();
    const totalRevenue = await prisma_2.default.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: prisma_1.PaymentStatus.PAID
        }
    });
    const barChartData = await getBarChartData();
    const pieChartData = await getPieChartData();
    return { adminCount, appointmentCount, patientCount, paymentCount, doctorCount, totalRevenue: totalRevenue._sum, barChartData, pieChartData };
};
const getAdminMetaData = async () => {
    const appointmentCount = await prisma_2.default.appointment.count();
    const patientCount = await prisma_2.default.patient.count();
    const paymentCount = await prisma_2.default.payment.count();
    const doctorCount = await prisma_2.default.doctor.count();
    const totalRevenue = await prisma_2.default.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: prisma_1.PaymentStatus.PAID
        }
    });
    const barChartData = await getBarChartData();
    const pieChartData = await getPieChartData();
    return { appointmentCount, patientCount, paymentCount, doctorCount, totalRevenue, barChartData, pieChartData };
};
const getDoctorMetaData = async (user) => {
    const doctorInfo = await prisma_2.default.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const doctorAppointmentCount = await prisma_2.default.appointment.count({
        where: {
            doctorId: doctorInfo.id
        }
    });
    const doctorPatientCount = await prisma_2.default.appointment.groupBy({
        by: ['patientId'],
        _count: {
            id: true
        }
    });
    const reviewCount = await prisma_2.default.review.count({
        where: {
            doctorId: doctorInfo.id
        }
    });
    const totalRevenue = await prisma_2.default.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appointment: {
                doctorId: doctorInfo.id
            }
        }
    });
    const appointmentStatusDistribution = await prisma_2.default.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: { doctorId: doctorInfo.id }
    });
    const formatAppointment = appointmentStatusDistribution.map((count) => ({
        status: count.status,
        count: Number(count._count.id)
    }));
    return { doctorAppointmentCount, doctorPatientCount: doctorPatientCount.length, reviewCount, totalRevenue: totalRevenue._sum, formatAppointment };
};
const getPatientMetaData = async (user) => {
    const patientInfo = await prisma_2.default.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });
    const patientAppointmentCount = await prisma_2.default.appointment.count({
        where: {
            patientId: patientInfo.id
        }
    });
    const prescriptionCount = await prisma_2.default.prescription.count({
        where: {
            patientId: patientInfo.id
        }
    });
    const reviewCount = await prisma_2.default.review.count({
        where: {
            patientId: patientInfo.id
        }
    });
    const appointmentStatusDistribution = await prisma_2.default.appointment.groupBy({
        by: ["status"],
        _count: { id: true },
        where: { patientId: patientInfo.id }
    });
    const formatAppointment = appointmentStatusDistribution.map((count) => ({
        status: count.status,
        count: Number(count._count.id)
    }));
    return { patientAppointmentCount, prescriptionCount, reviewCount, formatAppointment };
};
const getBarChartData = async () => {
    const appointmentCountByMonth = await prisma_2.default.$queryRawUnsafe(`
    SELECT DATE_TRUNC('month', "createdAt") AS month,
           COUNT(*)::int AS count
    FROM "appointments"
    GROUP BY month
    ORDER BY month ASC;
  `);
    return appointmentCountByMonth;
};
const getPieChartData = async () => {
    const appointmentStatusDistribution = await prisma_2.default.appointment.groupBy({
        by: ["status"],
        _count: { id: true }
    });
    const formatAppointment = appointmentStatusDistribution.map((count) => ({
        status: count.status,
        count: Number(count._count.id)
    }));
    return formatAppointment;
};
exports.metaService = {
    getMetaForDashBoard
};
