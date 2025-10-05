import axios from "axios";
import config from "../../../config";
import ApiError from "../../errors/ApiError";
import status from "http-status";

const initPayment = async (paymentData: any) => {
    try {
        const { amount, transactionId, patientName, patientEmail, patientAddress, patientPhoneNumber } = paymentData

        const data = {
            store_id: config.ssl.store_id,
            store_passwd: config.ssl.store_pass,
            total_amount: amount,
            currency: 'BDT',
            tran_id: transactionId, // use unique tran_id for each api call
            success_url: config.ssl.success_url,
            fail_url: config.ssl.fail_url,
            cancel_url: config.ssl.cancel_url,
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'N/A',
            product_name: 'Appointment.',
            product_category: 'Service',
            product_profile: 'general',
            cus_name: patientName,
            cus_email: patientEmail,
            cus_add1: patientAddress,
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: patientPhoneNumber,
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'N/A',
            ship_add2: 'N/A',
            ship_city: 'N/A',
            ship_state: 'N/A',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        };

        const response = await axios({
            method: "post",
            url: "https://sandbox.sslcommerz.com/gwprocess/v3/api.php",
            data: data,
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        })
        return response.data
    }
    catch (err) {
        throw new ApiError(status.BAD_REQUEST, "Payment error occurred.")
    }
}

const validatePayment = async (payload: any) => {
    try {
        const response = await axios({
            method: "GET",
            url: `${config.ssl.ssl_validation_url}?val_id=${payload.val_id}&store_id${config.ssl.store_id}&store_passw${config.ssl.store_pass}&format=json`
        })


        return response.data
    }
    catch (err) {
        throw new ApiError(status.BAD_REQUEST, "Payment validation FAIL!")
    }
}

export const sslService = {
    initPayment,
    validatePayment
}