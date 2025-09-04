import express, { NextFunction, Request, Response } from 'express';
import { specialtiesController } from './specialties.controller';
import { fileUploader } from '../../../helpers/fileUploaders';
import { specialtiesValidation } from './specialties.validation';
const router = express.Router()

router.post('/', fileUploader.upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = specialtiesValidation.create.parse(JSON.parse(req.body.data))
        return specialtiesController.insertIntoDb(req, res, next)
    })
router.get('/', specialtiesController.getAllSpecialtiesFromDb)

router.delete("/:id",
    specialtiesController.hardDeleteSpecialties
)
export const specialtiesRoute = router