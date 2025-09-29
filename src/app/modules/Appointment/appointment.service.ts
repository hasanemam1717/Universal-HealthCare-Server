import { v4 as uuidv4 } from "uuid";
import prisma from "../../../shared/prisma";
import { IAuthUser } from "../../interfaces/common";

const createAppointment = async (user: IAuthUser, payload: any) => {
    const patientInfo = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    })
    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id: payload.doctorId
        }
    })
    const doctorScheduleData = await prisma.doctorSchedules.findFirstOrThrow({
        where: {
            doctorId: doctorInfo.id,
            scheduleId: payload.scheduleId,
            isBooked: false
        }
    })

    const videoCallingId = uuidv4()
    const result = await prisma.appointment.create({
        data: {
            patientId: patientInfo.id,
            doctorId: doctorInfo.id,
            scheduleId: payload.scheduleId,
            videoCallingId
        },
        include: {
            patient: true,
            doctor: true,
            schedule: true
        }
    })
    return result
}

export const appointmentService = {
    createAppointment
}