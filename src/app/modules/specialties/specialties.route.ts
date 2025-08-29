import express, { NextFunction, Request, Response } from 'express';
import { specialtiesController } from './specialties.controller';
import { fileUploader } from '../../../helpers/fileUploaders';
const router = express.Router()

router.post('/', fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return specialtiesController.insertIntoDb(req, res, next)
    })
export const specialtiesRoute = router