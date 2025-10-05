import axios from "axios";
import config from "../../../config";
import prisma from "../../../shared/prisma";
import { sslService } from "../SSL/ssl.service";

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

export const paymentService = { initPayment }