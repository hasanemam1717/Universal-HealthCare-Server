import axios from "axios";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { sslService } from "../SSL/ssl.service";
import { PaymentStatus } from "../../../generated/prisma";

const initPayment = async (appointmentId: string) => {
    const paymentData = await prisma.payment.findFirstOrThrow({
        where: {
            appointmentId
        },
        include: {
            appointment: {
                include: {
                    patient: true
                }
            }
        }
    })
    const initPaymentData = {
        amount: paymentData.amount,
        transactionId: paymentData.transactionId,
        patientName: paymentData?.appointment?.patient?.name,
        patientEmail: paymentData?.appointment?.patient?.email,
        patientAddress: paymentData?.appointment?.patient?.address,
        patientPhoneNumber: paymentData?.appointment?.patient?.contactNumber,

    }

    const result = await sslService.initPayment(initPaymentData)
    return {
        paymentUrl: result?.GatewayPageURL
    }

}

const validatePayment = async (payload: any) => {
    // When the server is deployed uncomment this code for ssl commerce.
    // if (!payload || !payload?.status || !(payload?.status === "VALID")) {
    //     return { message: "INVALID payment!" }
    // }
    // const response = await sslService.validatePayment(payload)
    // if (response?.status !== 'VALID') {
    //     return { message: "Payment FAIL!" }
    // }


    // When the server is deployed comment this code 
    const response = payload

    await prisma.$transaction(async (tx) => {
        const updatedPaymentData = await tx.payment.update({
            where: {
                transactionId: response.tran_id
            },
            data: {
                status: PaymentStatus.PAID,
                paymentGatewayData: response
            }
        })
        await tx.appointment.update({
            where: {
                id: updatedPaymentData.appointmentId
            },
            data: {
                paymentStatus: PaymentStatus.PAID
            }
        })
    })

    return {
        message: "Payment successfully."
    }

}

export const paymentService = { initPayment, validatePayment }