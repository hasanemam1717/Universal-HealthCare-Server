import express from 'express';
import { userRoutes } from '../User/user.route';
import { adminRoutes } from '../Admin/admin.route';

const router = express.Router()

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    }, {
        path: '/admin',
        route: adminRoutes
    },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router