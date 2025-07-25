import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors'
import router from './app/modules/routes';
import status from 'http-status';
const app: Application = express()
app.use(cors())

// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
    res.send({
        massage: "Universal Health Care Server is running ⚡"
    })
})

app.use('/api/v1/', router)
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req);
    res.status(status.NOT_FOUND).json({
        success: false,
        massage: "API not found",
        error: {
            path: req?.originalUrl,
            errorMassage: "Your requested path is not found."
        }
    })
})




export default app