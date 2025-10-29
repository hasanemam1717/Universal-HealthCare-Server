"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../User/user.route");
const admin_route_1 = require("../Admin/admin.route");
const auth_route_1 = require("../Auth/auth.route");
const specialties_route_1 = require("../specialties/specialties.route");
const doctor_route_1 = require("../Doctor/doctor.route");
const patient_route_1 = require("../Patients/patient.route");
const doctorSchedule_route_1 = require("../DoctorSchedule/doctorSchedule.route");
const schedule_route_1 = require("../Schedule/schedule.route");
const appointment_route_1 = require("../Appointment/appointment.route");
const payment_routes_1 = require("../Payment/payment.routes");
const prescription_route_1 = require("../Prescription/prescription.route");
const review_route_1 = require("../Review/review.route");
const meta_route_1 = require("../Meta/meta.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: '/user',
        route: user_route_1.userRoutes
    },
    {
        path: '/admin',
        route: admin_route_1.adminRoutes
    },
    {
        path: '/doctor',
        route: doctor_route_1.doctorRoutes
    },
    {
        path: '/patient',
        route: patient_route_1.PatientRoutes
    },
    {
        path: '/specialties',
        route: specialties_route_1.specialtiesRoute
    },
    {
        path: '/auth',
        route: auth_route_1.authRouter
    },
    {
        path: '/schedule',
        route: schedule_route_1.scheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorSchedule_route_1.doctorScheduleRoutes
    },
    {
        path: '/appointment',
        route: appointment_route_1.appointmentRoutes
    },
    {
        path: '/payment',
        route: payment_routes_1.paymentRoutes
    },
    {
        path: '/prescription',
        route: prescription_route_1.prescriptionRoute
    },
    {
        path: '/review',
        route: review_route_1.reviewRoutes
    },
    {
        path: '/meta',
        route: meta_route_1.metaRoutes
    }
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
