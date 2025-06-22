import Content from "../model/content";
import { Tags } from "../model/tags";
import {
  contentSchema,
  deleteSchema,
  TContentSchema,
  TDeleteSchema,
} from "../schema/content.schema";
import { uploadCloudinary } from "../utils/cloudinary";

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

        if (req.file) {
            const localFilePath = req.file.path;
            const uploadFile = await uploadCloudinary(localFilePath);
            if (!uploadFile) {
                return res.status(400).json({
                    success: false,
                    message: "File upload failed"
                });
            }
            link = uploadFile.url;
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
            data: newContent
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: process.env.NODE_ENV === 'development' ? err : undefined
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