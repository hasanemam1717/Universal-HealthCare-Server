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
        jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN
    }
}