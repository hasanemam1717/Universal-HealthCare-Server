"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const prisma_1 = require("../../../generated/prisma");
const createAdmin = zod_1.z.object({
    password: zod_1.z.string({
        error: "Password is required"
    }),
    admin: zod_1.z.object({
        name: zod_1.z.string({
            error: "Name is required!"
        }),
        email: zod_1.z.string({
            error: "Email is required!"
        }),
        contactNumber: zod_1.z.string({
            error: "Contact Number is required!"
        })
    })
});
const createDoctor = zod_1.z.object({
    password: zod_1.z.string({
        error: "Password is required"
    }),
    doctor: zod_1.z.object({
        name: zod_1.z.string({
            error: "Name is required!"
        }),
        email: zod_1.z.string({
            error: "Email is required!"
        }),
        contactNumber: zod_1.z.string({
            error: "Contact Number is required!"
        }),
        address: zod_1.z.string().optional(),
        registrationNumber: zod_1.z.string({
            error: "Reg number is required"
        }),
        experience: zod_1.z.number().optional(),
        gender: zod_1.z.enum([prisma_1.Gender.MALE, prisma_1.Gender.FEMALE]),
        appointmentFee: zod_1.z.number({
            error: "appointment fee is required"
        }),
        qualification: zod_1.z.string({
            error: "quilification is required"
        }),
        currentWorkingPlace: zod_1.z.string({
            error: "Current working place is required!"
        }),
        designation: zod_1.z.string({
            error: "Designation is required!"
        })
    })
});
const createPatient = zod_1.z.object({
    password: zod_1.z.string(),
    patient: zod_1.z.object({
        email: zod_1.z.string({
            error: "Email is required!"
        }).email(),
        name: zod_1.z.string({
            error: "Name is required!"
        }),
        contactNumber: zod_1.z.string({
            error: "Contact number is required!"
        }),
        address: zod_1.z.string({
            error: "Address is required"
        })
    })
});
const updateStatus = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum([prisma_1.UserStatus.ACTIVE, prisma_1.UserStatus.BLOCKED, prisma_1.UserStatus.DELETED])
    })
});
exports.userValidation = {
    createAdmin,
    createDoctor,
    createPatient,
    updateStatus
};
