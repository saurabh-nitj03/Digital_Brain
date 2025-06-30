"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToCloudinary = exports.cloudinaryConnect = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// New: Cloudinary connect function
const cloudinaryConnect = () => {
    try {
        cloudinary_1.v2.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
    catch (e) {
        console.error('Cloudinary config error:', e);
    }
};
exports.cloudinaryConnect = cloudinaryConnect;
// New: Upload buffer (from multer memory storage) to Cloudinary
const uploadBufferToCloudinary = (buffer, filename, mimetype, folder, quality) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        const options = { resource_type: 'auto' };
        if (folder)
            options.folder = folder;
        if (quality)
            options.quality = quality;
        if (filename)
            options.public_id = filename;
        const stream = cloudinary_1.v2.uploader.upload_stream(options, (error, result) => {
            if (error)
                return reject(error);
            resolve(result);
        });
        stream.end(buffer);
    });
});
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
