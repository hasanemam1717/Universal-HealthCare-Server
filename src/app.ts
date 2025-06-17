import express, { Application, Request, Response } from 'express';
import cors from 'cors'
const app: Application = express()
app.use(cors())

async function main() {
    try {
        const server = app.get('/', (req: Request, res: Response) => {
            res.send({
                massage: "Universal Health Care Server is running ⚡"
            })
        })
    } catch (err) {
        console.log(err);
    }

}
main()



export default app