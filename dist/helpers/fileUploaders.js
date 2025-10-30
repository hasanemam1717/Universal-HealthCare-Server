"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploader = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
const config_1 = __importDefault(require("../config"));
// Configuration
cloudinary_1.v2.config({
    cloud_name: 'dwzjrzcq2',
    api_key: '246732558457642',
    api_secret: config_1.default.cloudinary_api_secret // Click 'View API Keys' above to copy your API secret
});
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(process.cwd(), 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
const uploadToCloudinary = async (file) => {
    // console.log(file);
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader
            .upload(file?.path, (error, result) => {
            fs_1.default.unlinkSync(file?.path);
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.fileUploader = {
    upload,
    uploadToCloudinary
};
