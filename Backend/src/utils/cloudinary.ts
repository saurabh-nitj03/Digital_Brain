import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import dotenv from "dotenv"

dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET, 
})

// Original: Upload from local file path (not used in production/cloud)
// const uploadCloudinary= async(localFilePath:any) => {
//     try{
//         if(!localFilePath) return null
//         // upload file on cloudinary
//         const res= await cloudinary.uploader.upload(localFilePath,{
//             resource_type:"auto",
//         });
//         return res;
//     } catch(err){
//         return null;
//     }
// }

// New: Upload from buffer (memory storage)
const uploadBufferToCloudinary = async (buffer: Buffer, filename: string, mimetype: string) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', public_id: filename },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(buffer);
    });
};

export { /*uploadCloudinary,*/ uploadBufferToCloudinary }
