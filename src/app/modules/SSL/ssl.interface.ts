export type IPaymentData = {
    amount: number,
    transactionId: string,
    patientName: string,
    patientEmail: string,
    patientAddress: string | null,
    patientPhoneNumber: string | null
}