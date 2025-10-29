import bcrypt from 'bcrypt';
import { UserRole } from "../src/generated/prisma";
import prisma from "../src/shared/prisma";

const seedSuperAdmin = async () => {
    try {
        const isExistSuperAdmin = await prisma.user.findFirst({
            where: {
                role: UserRole.SUPER_ADMIN
            }

        })
        if (isExistSuperAdmin) {
            console.log("Super Admin Already Exist.");
            return
        }
        const hashPassword: string = await bcrypt.hash("superAdmin", 12)
        const superAdminData = await prisma.user.create({
            data: {
                email: "super@admin.com",
                password: hashPassword,
                role: UserRole.SUPER_ADMIN,
                admin: {
                    create: {
                        name: "SUPER_ADMIN",
                        // email:"super@admin.com",
                        contactNumber: "01717680772",

                    }
                }
            }
        })
        console.log("Super admin created successfully.", superAdminData);

    }
    catch (err) {
        console.error(err);
    }
    finally {
        await prisma.$disconnect()
    }
}

seedSuperAdmin()