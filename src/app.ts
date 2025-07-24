import express, { Application, Request, Response } from 'express';
import cors from 'cors'
import router from './app/modules/routes';
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




export default app