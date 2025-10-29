"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specialtiesService = void 0;
const fileUploaders_1 = require("../../../helpers/fileUploaders");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const insertIntoDb = async (req) => {
    const file = req.file;
    if (file) {
        const uploadToCloudinary = await fileUploaders_1.fileUploader.uploadToCloudinary(file);
        req.body.icon = uploadToCloudinary?.secure_url;
    }
    const result = await prisma_1.default.specialties.create({
        data: req.body
    });
    return result;
};
const getAllSpecialtiesFromDb = async () => {
    const result = await prisma_1.default.specialties.findMany();
    return result;
};
const hardDeleteSpecialties = async (req) => {
    const result = await prisma_1.default.specialties.delete({
        where: {
            id: req.params.id
        }
    });
    return result;
};
exports.specialtiesService = {
    insertIntoDb,
    getAllSpecialtiesFromDb,
    hardDeleteSpecialties
};
