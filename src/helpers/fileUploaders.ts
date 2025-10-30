import multer from "multer"
import path from "path"
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { IFile, TCloudinaryUploadResponse } from "../app/interfaces/file";
import config from "../config";

// Configuration
cloudinary.config({
    cloud_name: 'dwzjrzcq2',
    api_key: '246732558457642',
    api_secret: config.cloudinary_api_secret // Click 'View API Keys' above to copy your API secret
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), 'uploads'))
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage: storage })

const uploadToCloudinary = async (file: IFile): Promise<TCloudinaryUploadResponse | undefined> => {
    // console.log(file);

    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload(
                file.path,
                (error: Error, result: TCloudinaryUploadResponse) => {
                    // fs.unlinkSync(file?.path)
                    if (error) {
                        reject(error)
                    } else {
                        resolve(result)
                    }
                })
    })
}

export const fileUploader = {
    upload,
    uploadToCloudinary
}
