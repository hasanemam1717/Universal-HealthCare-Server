"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../src/generated/prisma");
const prisma_2 = __importDefault(require("../src/shared/prisma"));
const seedSuperAdmin = async () => {
    try {
        const isExistSuperAdmin = await prisma_2.default.user.findFirst({
            where: {
                role: prisma_1.UserRole.SUPER_ADMIN
            }
        });
        if (isExistSuperAdmin) {
            console.log("Super Admin Already Exist.");
            return;
        }
        const hashPassword = await bcrypt_1.default.hash("superAdmin", 12);
        const superAdminData = await prisma_2.default.user.create({
            data: {
                email: "super@admin.com",
                password: hashPassword,
                role: prisma_1.UserRole.SUPER_ADMIN,
                admin: {
                    create: {
                        name: "SUPER_ADMIN",
                        // email:"super@admin.com",
                        contactNumber: "01717680772",
                    }
                }
            }
        });
        console.log("Super admin created successfully.", superAdminData);
    }
    catch (err) {
        console.error(err);
    }
    finally {
        await prisma_2.default.$disconnect();
    }
};
seedSuperAdmin();
