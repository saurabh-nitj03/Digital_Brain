declare global{
    namespace Express{
        export interface Request{
            userId?:string;
        }
    }
}

import express from "express";
import connectToDB from "./db/connect";
import cors from "cors"
import cookieParser from "cookie-parser"
import userRoutes from "./routes/user.routes";
import contentRoutes from "./routes/content.route";
import brainRoutes from "./routes/brain.route"

// import mongoose from "mongoose";
// import jwt from "jsonwebtoken";
// import User from "./model/user";
// import { userMiddleware } from "./middleware/middleware";
// import Content from "./model/content";
// import Link from "./model/link"
// import random from "./util";
// import bcrypt from "bcrypt"
// import { signinSchema, signupSchema, TSigninSchema, TSignupSchema } from "./schema/user.schema";
// import { JWT_PASSWORD } from "./utils/constant";
// import { contentSchema, deleteSchema, TContentSchema, TDeleteSchema } from "./schema/content.schema";
// import { getSharedLinkSchema, shareSchema, TGetSharedLinkSchema, TShareSchema } from "./schema/brain.schema";
// import { Tags } from "./model/tags";
// import upload from "./middleware/multer";
// import { uploadCloudinary } from "./utils/cloudinary";

connectToDB();
const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.listen(8000)

app.get('/', (req, res) => {
  res.send('Hello World');  
});

app.use("/api/v1/content", contentRoutes);
app.use("/api/v1/brain", brainRoutes);
app.use("/api/v1", userRoutes);

// app.post('/api/v1/signup',async(req : any,res : any)=>{
//     try{
//         // const {username,password} = req.body;
//         const parsed = signupSchema.safeParse(req.body);
//         if(!parsed.success){
//             return res.status(403).json({
//                 success:false,
//                 message:parsed.error.issues[0].message
//             })
//         }
          
//         const {username,password , confirmPassword}:TSignupSchema=req.body;
//         const user =await User.findOne({username});
//         if(user){
//             return res.status(403).json({
//                 success:false,
//                 message:"User already existed with this username"
//             })
//         }
//         const hashedPassword=await bcrypt.hash(password,2);
//         const newUser = await User.create({
//             username:username,
//             password:hashedPassword
//         })
        
//         if(!newUser){
//             return res.status(403).json({
//                 success:false,
//                 message:"User creation failed"
//             })
//         }
    
//         return res.status(201).json({
//             success:true,
//             message:"user signed up successfully"
//         })
//     } catch(err){
//         return res.status(500).send({
//             success:false,
//             message:"Something went wrong"
//         })
//     }

// })

// app.post("/api/v1/signin",async(req:any,res:any)=>{
//     try{
//         const parsed = signinSchema.safeParse(req.body);
//         if(!parsed.success){
//             return res.status(403).json({
//                 success:false,
//                 message:parsed.error.issues[0].message
//             })
//         }
//         const {username,password}:TSigninSchema=req.body;
//         const user=await User.findOne({username});
//         if(!user){
//             return res.status(403).json({
//                 success:false,
//                 message:"User doesnot exist"
//             })
//         }
//         const PasswordCorrect=await bcrypt.compare(password,user.password)
//         if(!PasswordCorrect){
//             return res.status(403).json({
//                 success:false,
//                 message:"Password is not correct"
//             })
//         }
//         const token=jwt.sign({id:user._id},JWT_PASSWORD,{
//                 expiresIn:"1d"
//             })
//         res.cookie("jwt", token, user._id, {
//             httpOnly: true,
//             secure: true,
//             expires: "1d",
//         });
//         return res.status(200).json({
//                 success:true,
//                 message:"User signed in Successfully",
//                 token
//             })
//     } catch(err){
//         return res.status(500).json({
//             success:false,
//             message:"Something went wrong"+err
//         })
//     }
// })

// app.post("/api/v1/signout",userMiddleware,async(req:any,res:any)=>{
//     try {
//         res.cookie("jwt", "", {
//             httpOnly: true,
//             secure: true,
//             expires: new Date(0),
//         });
//         return res.status(200).json({
//             success: true,
//             message: "User logged out successfully",
//         });
//   } catch (error) {
//         // console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Something went wrong",
//         });
//   }
// })

// app.get("/api/v1/check",userMiddleware,async(req:any,res:any)=>{
//     try{
//         res.status(200).json({
//         success: true,
//         userId:req.userId,
//         message: "User is authenticated",});
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             isAuthenticated: false,
//             message: "An error occurred while checking authentication",
//          });
//     }
// })
// app.post('/api/v1/content', userMiddleware, upload.single("file"), async (req: any, res: any) => {
//     try {

//         const parsed = contentSchema.safeParse(req.body);
//         if (!parsed.success) {
//             return res.status(400).json({
//                 success: false,
//                 message: parsed.error.issues[0].message,
//                 errors: parsed.error.issues
//             });
//         }

//         let { link, title, type, content, tags }: TContentSchema = parsed.data;

//         let allTags: string[] = [];
//         if (tags && tags.length > 0) {
//             if (tags.length > 10) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Maximum 10 tags allowed"
//                 });
//             }

//             let existingTags = await Tags.find({ title: { $in: tags } });
//             let existingTagsTitle = existingTags.map((item) => item.title);

//             let newTagsTitle = tags.filter((tag) => !existingTagsTitle.includes(tag));

//             if (newTagsTitle.length > 0) {
//                 const newTags = await Tags.insertMany(newTagsTitle.map((tag) => ({ title: tag })));
//                 allTags = [...existingTagsTitle, ...newTags.map((tag) => tag.title)];
//             } else {
//                 allTags = existingTagsTitle;
//             }
//         }

//         if (req.file) {
//             const localFilePath = req.file.path;
//             console.log("Uploading file from:", localFilePath);
            
//             const uploadFile = await uploadCloudinary(localFilePath);
//             console.log("Upload result:", uploadFile);
            
//             if (!uploadFile) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "File upload failed"
//                 });
//             }
//             link = uploadFile.url;
//         }

//         if ((type === "youtube" || type === "twitter" || type === "link") && !link) {
//             return res.status(400).json({
//                 success: false,
//                 message: `Link is required for ${type} content`
//             });
//         }

//         if ((type === "image" || type === "document") && !link && !req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: `File is required for ${type} content`
//             });
//         }

//         const newContent = await Content.create({
//             title,
//             type,
//             link,
//             content,
//             tags: allTags,
//             userId: req.userId,
//         });

//         if (!newContent) {
//             return res.status(500).json({
//                 success: false,
//                 message: "Content creation failed"
//             });
//         }

//         return res.status(201).json({
//             success: true,
//             message: "Content added successfully",
//             data: newContent
//         });

//     } catch (err) {
//         // console.error("Error in content creation:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error",
//             error: process.env.NODE_ENV === 'development' ? err : undefined
//         });
//     }
// });


// app.get("/api/v1/content",userMiddleware,async(req:any,res:any)=>{
//     try{
//         const userId=req.userId;
    
//         const content = await Content.find({
//             userId:userId
//         }).populate("userId").sort({createdAt:-1});
//         if(!content){
//             return res.status(403).json({
//                 success:false,
//                 message:"Content Not Found"
//             })
//         }
//         return res.status(200).json({
//             success:true,
//             message:"Content found successfully",
//             content
//         })
//     } catch(err){
//         return res.status(403).json({
//             success:false,
//             message:err
//         })
//     }
// })

// app.delete("/api/v1/content",userMiddleware,async(req:any,res:any)=>{
//     try{
//         const parsed=deleteSchema.safeParse(req.body);
//         if(!parsed.success){
//             return res.status(403).json({
//                 success:false,
//                 message:parsed.error.issues[0].message
//             })
//         }
//         const {contentId}:TDeleteSchema=req.body;
//         // console.log(contentId ,req.userId)
//             const content = await Content.findOneAndDelete({
//             _id: contentId,
//             userId: req.userId,
//             });
//         if(!content){
//             return res.status(403).json({
//                 success:false,
//                 message:"Content not found"
//             })
//         }
        
//         return res.status(200).json({
//             success:true,
//             message:"Content deleted Successfuly"
//         })
//     } catch(err){
//         return res.status(403).json({
//             success:false,
//             message:err
//         })
//     }
// })

// app.post("/api/v1/content/search",async(req:any,res:any)=>{
//        try { 
//         const {userId,query}=req.body;
//         // console.log(query,userId)
//         if(!userId ){
//             return res.status(403).json({
//                 success:false,
//                 message:"User id is required"
//             })
//         }
//         if(!query || typeof query !== "string"){
//             return res.status(403).json({
//                 success:false,
//                 message:"Query is required"
//             })
//         }

//         const q=query.trim();
//         const response =await Content.find({
//             userId:userId,
//             $or:[
//                 {content:{$regex:q,$options:"i"}},
//                 {tags:{$elemMatch:{$regex:q,$options:"i"}}}
//             ]
//         })
//         // console.log(response)
//         if(!response){
//             return res.status(403).json({
//                 success:false,
//                 message:"Content not fetched"
//             })
//         }
//         res.status(200).json({
//             success:true,
//             content:response,
//             message:"Content fetched successfully"
//         })}
//         catch(err){
//             return res.status(403).json({
//                 success:false,
//                 message:err
//             })
//         }

// })

// app.get("/api/v1/brain/getuser/:username",async(req:any,res:any)=>{
//     try{
//         const username=req.params.username;
//         // console.log(username);
//         const response = await User.findOne({username});
//         // console.log(response)
//         if(!response ||  response === null){
//             return res.status(404).json({
//                 success:false,
//                 message:"No user existed with this username"
//             })
//         } 
//         const link=await Link.findOne({userId:response._id}).populate("userId","username");
//         if(!link){
//             return res.status(403).json({
//                 success:false,
//                 message:"No shared link existed with this username"
//             })
//         }
//         // console.log(link)
//         return res.status(200).json({
//             success:true,
//             message:"Shared Link found",
//             link:[link]
//         })
//     } catch(err){
//         return res.status(403).json({
//             success:false,
//             message:err
//         })
//     }
// })

// app.post("/api/v1/brain/share",userMiddleware, async(req:any,res:any)=>{
//     try{
//         const parsed=shareSchema.safeParse(req.body);
//         if(!parsed.success){
//             return res.status(403).json({
//                 success:false,
//                 message:parsed.error.issues[0].message
//             })
//         }
//         const {share}:TShareSchema=req.body;
//         if(share){
//             const existingLink=await Link.findOne({userId:req.userId});
//             if(existingLink){
//                return res.status(200).json({
//                     success:true,
//                     message:"Link shared successfully",
//                     hash: existingLink.hash 
//                 })
                 
//             }
//             const hash=random(10)
//             const newLink = await Link.create({
//                 userId:req.userId,
//                 hash
//             })
//             if(!newLink){
//                 return res.status(403).json({
//                     success:false,
//                     message:"Link could not created"
//                 })
//             }
//             return res.status(200).json({
//                 success:true,
//                 message:"Link shared successfully",
//                 hash:newLink.hash
//             })
//         } else {
//             const deletedLink = await Link.deleteOne({
//                 userId:req.userId
//             })
//              if (!deletedLink) {
//             return res.status(403).json({
//               success: false,
//               message: "Link not found",
//             });
//           }
    
//           res.status(200).json({
//             success: true,
//             message: "Link removed successfully",
//           });
//         } 

//     } catch(err){
//         return res.status(500).json({
//             success:false,
//             message:err
//         })
//     }

   
// })
// app.get("/api/v1/brain/:shareLink",async(req:any,res:any)=>{
//     try{
//         const parsed=getSharedLinkSchema.safeParse(req.params);
//         if(!parsed.success){
//             return res.status(403).json({
//                 success:false,
//                 message:parsed.error.issues[0].message
//             })
//         }
//         const {shareLink}:TGetSharedLinkSchema=req.params;
//         const link=await Link.findOne({
//             hash:shareLink
//         })
//         if(!link){
//            return res.status(403).json({
//                 success:false,
//                 message:"Link Not Found"
//             })
//         }
//         const content=await Content.find({
//             userId:link.userId
//         }).populate("userId","username").sort({created:-1});
//     //    console.log(content)
//           if (!content) {
//           return res.status(403).json({
//             success: false,
//             message: "Content not found",
//           });
//         }
    
//         res.status(200).json({
//           success: true,
//           message: "Content found successfully",
//           content,
//         });

//     } catch(err){
//         return res.status(403).json({
//             success:false,
//             message:err
//         })
//     }
// })
// app.get("/api/v1/content/:type",userMiddleware,async(req:any,res:any)=>{
//     try{
//         const type=req.params.type;
//         const userId=req.userId;
//         const content = await Content.find({
//             userId:userId,
//             type:type
//         }).populate("userId").sort({createdAt:-1});
//         if(!content){
//             return res.status(403).json({
//                 success:false,
//                 message:"Content Not found of this type"
//             })
//         }
//         res.status(200).json({
//             success:true,
//             message:"Content fetched successfully",
//             content
//         })

//     } catch(err){
//        return res.statu(403).json({
//         success:false,
//         message:err
//        })
//     }
// })

// app.get("/api/v1/brain/shared-brain",async(req,res)=>{
//      try {
//     const sharedLinks = await Link.find({})
//       .populate("userId", "username")
//       .sort({ createdAt: -1 });

//     // console.log(sharedLinks);
//     res.status(200).json({
//       success: true,
//       message: "Shared links fetched successfully",
//       data: sharedLinks,
//     });
//   } catch (error) {
//     // console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while fetching shared links",
//     });
//   }
// })
