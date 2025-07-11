// import multer from "multer"

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


import multer from "multer";

const storage = multer.diskStorage({
    filename:function(req, file, callback) {
        callback(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

export default upload