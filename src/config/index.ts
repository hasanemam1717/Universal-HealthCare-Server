import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    jwt: {
        jwt_secret: process.env.JWT_SECRET,
        jwt_refresh_token: process.env.JWT_REFRESH_TOKEN,
        jwt_expire_in: process.env.EXPIRE_IN,
        jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
        jwt_secret_reset_password: process.env.JWT_SECRET_RESET_PASSWORD

    },
    reset_password_link: process.env.RESET_PASSWORD_LINK,
    emailSender: {
        email: process.env.EMAIL,
        password: process.env.PASSWORD
    },
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    ssl: {
        store_id: process.env.STOR_ID,
        store_pass: process.env.STORE_PASS,
        success_url: process.env.SUCCESS_URL,
        fail_url: process.env.FAIL_URL,
        cancel_url: process.env.CANCEL_URL,
        ssl_payment_url: process.env.ssl_SSL_PAYMENT_API,
        ssl_validation_url: process.env.SSL_VALIDATION_API,
    }
}