import Content from "../model/content";
import { Tags } from "../model/tags";
import {
  contentSchema,
  deleteSchema,
  TContentSchema,
  TDeleteSchema,
} from "../schema/content.schema";
import {  cloudinaryConnect } from "../utils/cloudinary";
import { ContentProcessor } from "../utils/contentProcessor";
import { AIAgent } from "../utils/aiAgent";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

// Initialize AI Agent
const aiAgent = new AIAgent();

// At the top of your file, call cloudinaryConnect once (if not already called in your app entry)
// cloudinaryConnect();
async function uploadFileToCloudinary(file:any, folder:any) {
    const options: { folder: any; resource_type?: "image" | "raw" | "auto" | "video"; quality?: any } = { folder };
    options.resource_type = "image";
    return await cloudinary.uploader.upload(file.path, options);
};

export const createContent=async (req: any, res: any) => {
    try {
          let processedBody = { ...req.body };
        if (req.body.tags) {
            processedBody.tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
        }
        const parsed = contentSchema.safeParse(processedBody);
        if (!parsed.success) {
            return res.status(400).json({
                success: false,
                message: parsed.error.issues[0].message,
                errors: parsed.error.issues
            });
        }

        let { link, title, type, content, tags }: TContentSchema = parsed.data;

        let allTags: string[] = [];
        if (tags && tags.length > 0) {
            if (tags.length > 10) {
                return res.status(400).json({
                    success: false,
                    message: "Maximum 10 tags allowed"
                });
            }

            let existingTags = await Tags.find({ title: { $in: tags } });
            let existingTagsTitle = existingTags.map((item:any) => item.title);

            let newTagsTitle = tags.filter((tag:any) => !existingTagsTitle.includes(tag));

            if (newTagsTitle.length > 0) {
                const newTags = await Tags.insertMany(newTagsTitle.map((tag:any) => ({ title: tag })));
                allTags = [...existingTagsTitle, ...newTags.map((tag:any) => tag.title)];
            } else {
                allTags = existingTagsTitle;
            }
        }

        // Process content for AI agent BEFORE uploading to Cloudinary
        let aiProcessingResult = null;
        if (req.file) {
            try {
                // --- Always use a buffer for AI processing ---
                let fileBuffer;
                if (req.file.buffer) {
                    fileBuffer = req.file.buffer;
                } else if (req.file.path) {
                    fileBuffer = fs.readFileSync(req.file.path);
                }
                console.log('AI Processing file:', {
                  mimetype: req.file.mimetype,
                  hasBuffer: !!fileBuffer,
                  bufferType: typeof fileBuffer,
                  bufferIsBuffer: Buffer.isBuffer(fileBuffer)
                });
                aiProcessingResult = await aiAgent.processAndStoreContent(
                    req.userId,
                    fileBuffer,
                    req.file.mimetype
                );

                if (aiProcessingResult.success) {
                    console.log("File processed for AI agent:", aiProcessingResult.message);
                } else {
                    console.warn("AI agent processing failed:", aiProcessingResult.message);
                }
            } catch (aiError) {
                console.error("AI agent processing error:", aiError);
                // Continue with content creation even if AI processing fails
            }
        }

        // Now upload to Cloudinary
        if (req.file) {
            try {
                // --- Legacy: Disk-based Cloudinary upload (commented out) ---
                // const localFilePath = req.file.path;
                // const uploadFile = await uploadCloudinary(localFilePath);
                // if (!uploadFile) {
                //     return res.status(400).json({
                //         success: false,
                //         message: "File upload failed"
                //     });
                // }
                // link = uploadFile.url;

                // --- New: Buffer-based Cloudinary upload ---
                // const uploadFile: any = await uploadBufferToCloudinary(
                //     req.file.buffer,
                //     req.file.originalname,
                //     req.file.mimetype, // optional: set a folder in Cloudinary
                // );
                const uploadFile=await uploadFileToCloudinary(req.file,"DigialBrain")
                if (!uploadFile) {
                    return res.status(400).json({
                        success: false,
                        message: "File upload failed"
                    });
                }
                link = uploadFile.secure_url || uploadFile.url;
            } catch (cloudErr) {
                return res.status(400).json({
                    success: false,
                    message: "File upload failed",
                    error: (cloudErr as Error)?.message || String(cloudErr)
                });
            }
        }

        // Process other content types for AI agent
        if (!req.file) {
            try {
                let contentToProcess: string | Buffer | undefined;
                let contentType: string | undefined;

                if (link && (type === "youtube" || type === "twitter" || type === "link")) {
                    // For URLs, process the link
                    contentToProcess = link;
                } else if (content) {
                    // For text content
                    contentToProcess = content;
                } else {
                    // Skip processing if no processable content
                    console.log("No processable content found for AI agent");
                }

                // Process and store embeddings if we have content to process
                if (contentToProcess) {
                    aiProcessingResult = await aiAgent.processAndStoreContent(
                        req.userId,
                        contentToProcess,
                        contentType
                    );

                    if (aiProcessingResult.success) {
                        console.log("Content processed for AI agent:", aiProcessingResult.message);
                    } else {
                        console.warn("AI agent processing failed:", aiProcessingResult.message);
                    }
                }
            } catch (aiError) {
                console.error("AI agent processing error:", aiError);
            }
        }

        if ((type === "youtube" || type === "twitter" || type === "link") && !link) {
            return res.status(400).json({
                success: false,
                message: `Link is required for ${type} content`
            });
        }

        if ((type === "image" || type === "document") && !link && !req.file) {
            return res.status(400).json({
                success: false,
                message: `File is required for ${type} content`
            });
        }

        const newContent = await Content.create({
            title,
            type,
            link,
            content,
            tags: allTags,
            userId: req.userId,
        });

        if (!newContent) {
            return res.status(500).json({
                success: false,
                message: "Content creation failed"
            });
        }

        return res.status(201).json({
            success: true,
            message: "Content added successfully",
            data: newContent,
            aiProcessing: aiProcessingResult ? {
                success: aiProcessingResult.success,
                message: aiProcessingResult.message
            } : null
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err
        });
    }
}

export const getContent = async(req:any,res:any)=>{
    try{
        const userId=req.userId;
    
        const content = await Content.find({
            userId:userId
        }).populate("userId").sort({createdAt:-1});
        if(!content){
            return res.status(403).json({
                success:false,
                message:"Content Not Found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Content found successfully",
            content
        })
    } catch(err){
        return res.status(403).json({
            success:false,
            message:err
        })
    }
}

export const deleteContent = async(req:any,res:any)=>{
    try{
        const parsed=deleteSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(403).json({
                success:false,
                message:parsed.error.issues[0].message
            })
        }
        const {contentId}:TDeleteSchema=req.body;
        // console.log(contentId ,req.userId)
            const content = await Content.findOneAndDelete({
            _id: contentId,
            userId: req.userId,
            });
        if(!content){
            return res.status(403).json({
                success:false,
                message:"Content not found"
            })
        }
        
        return res.status(200).json({
            success:true,
            message:"Content deleted Successfuly"
        })
    } catch(err){
        return res.status(403).json({
            success:false,
            message:err
        })
    }
}

export const contentSearch = async(req:any,res:any)=>{
       try { 
        const {userId,query}=req.body;
        // console.log(query,userId)
        if(!userId ){
            return res.status(403).json({
                success:false,
                message:"User id is required"
            })
        }
        if(!query || typeof query !== "string"){
            return res.status(403).json({
                success:false,
                message:"Query is required"
            })
        }

        const q=query.trim();
        const response =await Content.find({
            userId:userId,
            $or:[
                {content:{$regex:q,$options:"i"}},
                {tags:{$elemMatch:{$regex:q,$options:"i"}}}
            ]
        })
        // console.log(response)
        if(!response){
            return res.status(403).json({
                success:false,
                message:"Content not fetched"
            })
        }
        res.status(200).json({
            success:true,
            content:response,
            message:"Content fetched successfully"
        })}
        catch(err){
            return res.status(403).json({
                success:false,
                message:err
            })
        }

}

export const contentType=async(req:any,res:any)=>{
    try{
        const type=req.params.type;
        const userId=req.userId;
        const content = await Content.find({
            userId:userId,
            type:type
        }).populate("userId").sort({createdAt:-1});
        if(!content){
            return res.status(403).json({
                success:false,
                message:"Content Not found of this type"
            })
        }
        res.status(200).json({
            success:true,
            message:"Content fetched successfully",
            content
        })

    } catch(err){
       return res.statu(403).json({
        success:false,
        message:err
       })
    }
}

export const queryContent = async(req: any, res: any) => {
    try {
        const { question } = req.body;
        const userId = req.userId;

        if (!question || typeof question !== "string") {
            return res.status(400).json({
                success: false,
                message: "Question is required"
            });
        }

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }

        const response = await aiAgent.queryAgent(userId, question);

        return res.status(200).json({
            success: true,
            answer: response.answer,
            sources: response.sources,
            confidence: response.confidence
        });

    } catch (error) {
        console.error('Error in queryContent:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

// export const getContentSummary = async(req: any, res: any) => {
//     try {
//         const userId = req.userId;

//         if (!userId) {
//             return res.status(401).json({
//                 success: false,
//                 message: "User not authenticated"
//             });
//         }

//         const summary = await aiAgent.getUserContentSummary(userId);

//         return res.status(200).json({
//             success: true,
//             summary
//         });

//     } catch (error) {
//         console.error('Error in getContentSummary:', error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal server error"
//         });
//     }
// }
// {
//    "userId":"6859764bb85d17bc5d8a847f",
//    "question":"Who created this file ? What is the minor project"
// }