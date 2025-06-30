"use strict";
// import multer from "multer"
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
// import multer from 'multer';
// // New: Use memory storage for production/cloud compatibility
// const storage = multer.memoryStorage();
// export const upload = multer({ storage });
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.diskStorage({
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
exports.default = upload;
