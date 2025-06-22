import Content from "../model/content";
import Link from "../model/link";
import {
    shareSchema,
    TShareSchema,
  getSharedLinkSchema,
  TGetSharedLinkSchema,
} from "../schema/brain.schema";
import { random } from "../utils/constant";
import User from "../model/user";

export const createLink=async(req:any,res:any)=>{
    try{
        const parsed=shareSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(403).json({
                success:false,
                message:parsed.error.issues[0].message
            })
        }
        const {share}:TShareSchema=req.body;
        if(share){
            const existingLink=await Link.findOne({userId:req.userId});
            if(existingLink){
               return res.status(200).json({
                    success:true,
                    message:"Link shared successfully",
                    hash: existingLink.hash 
                })
                 
            }
            const hash=random(10)
            const newLink = await Link.create({
                userId:req.userId,
                hash
            })
            if(!newLink){
                return res.status(403).json({
                    success:false,
                    message:"Link could not created"
                })
            }
            return res.status(200).json({
                success:true,
                message:"Link shared successfully",
                hash:newLink.hash
            })
        } else {
            const deletedLink = await Link.deleteOne({
                userId:req.userId
            })
             if (!deletedLink) {
            return res.status(403).json({
              success: false,
              message: "Link not found",
            });
          }
    
          res.status(200).json({
            success: true,
            message: "Link removed successfully",
          });
        } 

    } catch(err){
        return res.status(500).json({
            success:false,
            message:err
        })
    }  
}

export const getLink=async(req:any,res:any)=>{
    try{
        const parsed=getSharedLinkSchema.safeParse(req.params);
        if(!parsed.success){
            return res.status(403).json({
                success:false,
                message:parsed.error.issues[0].message
            })
        }
        const {shareLink}:TGetSharedLinkSchema=req.params;
        const link=await Link.findOne({
            hash:shareLink
        })
        if(!link){
           return res.status(403).json({
                success:false,
                message:"Link Not Found"
            })
        }
        const content=await Content.find({
            userId:link.userId
        }).populate("userId","username").sort({createdAt:-1});
    //    console.log(content)
          if (!content) {
          return res.status(403).json({
            success: false,
            message: "Content not found",
          });
        }
    
        res.status(200).json({
          success: true,
          message: "Content found successfully",
          content,
        });

    } catch(err){
        return res.status(403).json({
            success:false,
            message:err
        })
    }
}

export const getAllSharedLink=async(req:any,res:any)=>{
     try {
    const sharedLinks = await Link.find({})
      .populate("userId", "username")
      .sort({ createdAt: -1 });

    // console.log(sharedLinks);
    res.status(200).json({
      success: true,
      message: "Shared links fetched successfully",
      data: sharedLinks,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching shared links",
    });
  }
}

export const getUser = async(req:any,res:any)=>{
    try{
        const username=req.params.username;
        // console.log(username);
        const response = await User.findOne({username});
        // console.log(response)
        if(!response ||  response === null){
            return res.status(404).json({
                success:false,
                message:"No user existed with this username"
            })
        } 
        const link=await Link.findOne({userId:response._id}).populate("userId","username");
        if(!link){
            return res.status(403).json({
                success:false,
                message:"No shared link existed with this username"
            })
        }
        // console.log(link)
        return res.status(200).json({
            success:true,
            message:"Shared Link found",
            link:[link]
        })
    } catch(err){
        return res.status(403).json({
            success:false,
            message:err
        })
    }
}