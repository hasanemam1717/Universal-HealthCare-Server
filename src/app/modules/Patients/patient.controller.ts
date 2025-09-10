import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { patientFilterableFields } from './patient.constant';
import { PatientService } from './patient.service';
import status from 'http-status';
import pick from '../../../shared/pick';

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder']);

    const result = await PatientService.getAllFromDB(filters, options);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: 'Patient retrieval successfully',
        meta: result.meta,
        data: result.data,
    });
});

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {

    const { id } = req.params;
    const result = await PatientService.getByIdFromDB(id);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: 'Patient retrieval successfully',
        data: result,
    });
});

const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.updateIntoDB(id, req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: 'Patient updated successfully',
        data: result,
    });
});

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: 'Patient deleted successfully',
        data: result,
    });
});


const softDelete = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PatientService.softDelete(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        massage: 'Patient soft deleted successfully',
        data: result,
    });
});

export const PatientController = {
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDelete,
};