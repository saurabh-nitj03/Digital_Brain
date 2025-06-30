"use strict";
// import multer from "multer"
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// const storage=multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,'./public/temp')
//     },
//     filename:function(req,file,cb){
//         cb(null , file.originalname)
//     }
// })
// const upload =multer({storage:storage})
// export default upload
const multer_1 = __importDefault(require("multer"));
// New: Use memory storage for production/cloud compatibility
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage });
