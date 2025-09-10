import express from 'express';
import { userRoutes } from '../User/user.route';
import { adminRoutes } from '../Admin/admin.route';
import { authRouter } from '../Auth/auth.route';
import { specialtiesRoute } from '../specialties/specialties.route';
import { doctorRoutes } from '../Doctor/doctor.route';
import { PatientRoutes } from '../Patients/patient.route';

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
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router