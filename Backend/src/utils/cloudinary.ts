// import {v2 as cloudinary} from "cloudinary"
// import fs from "fs"
// import dotenv from "dotenv"
//
// dotenv.config();
//
// cloudinary.config({
//     cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
//     api_key:process.env.CLOUDINARY_API_KEY,
//     api_secret:process.env.CLOUDINARY_API_SECRET, 
// })
//
// const uploadCloudinary= async(localFilePath:any) => {
//     try{
//         if(!localFilePath) return null
//         // upload file on cloudinary
//
//         const res= await cloudinary.uploader.upload(localFilePath,{
//             resource_type:"auto",
//         });
//         // console.log("File  uploaded successfully",res.url)
//         fs.unlinkSync(localFilePath);
//         return res;
//     } catch(err){
//         fs.unlinkSync(localFilePath) // resmove locally ssaved temp file as upload operation got failed
//         return null;
//     }
// }

import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// New: Cloudinary connect function
export const cloudinaryConnect = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    } catch (e) {
        console.error('Cloudinary config error:', e);
    }
};

// New: Upload buffer (from multer memory storage) to Cloudinary
export const uploadBufferToCloudinary = async (buffer: Buffer, filename: string, mimetype: string, folder?: string, quality?: string) => {
    return new Promise((resolve, reject) => {
        const options: any = { resource_type: 'auto' };
        if (folder) options.folder = folder;
        if (quality) options.quality = quality;
        if (filename) options.public_id = filename;

        const stream = cloudinary.uploader.upload_stream(options, (error, result) => {
            if (error) return reject(error);
            resolve(result);
        });
        stream.end(buffer);
    });
};
