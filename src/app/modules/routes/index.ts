import express from 'express';
import { userRoutes } from '../User/user.route';
import { adminRoutes } from '../Admin/admin.route';
import { authRouter } from '../Auth/auth.route';

const router = express.Router()

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    }, {
        path: '/admin',
        route: adminRoutes
    },
    {
        path: '/auth',
        route: authRouter
    }
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router