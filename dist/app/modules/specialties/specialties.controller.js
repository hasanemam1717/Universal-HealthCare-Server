"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtiesController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const specialties_service_1 = require("./specialties.service");
const insertIntoDb = (0, catchAsync_1.default)(async (req, res) => {
    const result = await specialties_service_1.specialtiesService.insertIntoDb(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        massage: "Specialties created successfully.",
        success: true,
        data: result
    });
});
const getAllSpecialtiesFromDb = (0, catchAsync_1.default)(async (req, res) => {
    const result = await specialties_service_1.specialtiesService.getAllSpecialtiesFromDb();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        massage: "Specialties data retrieve successfully.",
        success: true,
        data: result
    });
});
const hardDeleteSpecialties = (0, catchAsync_1.default)(async (req, res) => {
    const result = await specialties_service_1.specialtiesService.hardDeleteSpecialties(req);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        massage: "Specialties data deleted successfully.",
        success: true,
        data: result
    });
});
exports.specialtiesController = {
    insertIntoDb,
    getAllSpecialtiesFromDb,
    hardDeleteSpecialties
};
