import express from 'express';
import { userRoutes } from '../User/user.route';
import { adminRoutes } from '../Admin/admin.route';
import { authRouter } from '../Auth/auth.route';
import { specialtiesRoute } from '../specialties/specialties.route';
import { doctorRoutes } from '../Doctor/doctor.route';
import { PatientRoutes } from '../Patients/patient.route';
import { doctorScheduleRoutes } from '../DoctorSchedule/doctorSchedule.route';
import { scheduleRoutes } from '../Schedule/schedule.route';
import { appointmentRoutes } from '../Appointment/appointment.route';
import { paymentRoutes } from '../Payment/payment.routes';
import { prescriptionRoute } from '../Prescription/prescription.route';
import { reviewRoutes } from '../Review/review.route';

const router = express.Router()

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/admin',
        route: adminRoutes
    },
    {
        path: '/doctor',
        route: doctorRoutes
    },
    {
        path: '/patient',
        route: PatientRoutes
    },
    {
        path: '/specialties',
        route: specialtiesRoute
    },
    {
        path: '/auth',
        route: authRouter
    },
    {
        path: '/schedule',
        route: scheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: doctorScheduleRoutes
    },
    {
        path: '/appointment',
        route: appointmentRoutes
    },
    {
        path: '/payment',
        route: paymentRoutes
    },
    {
        path: '/prescription',
        route: prescriptionRoute
    },
    {
        path: '/review',
        route: reviewRoutes
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router