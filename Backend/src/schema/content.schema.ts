import mongoose from "mongoose";
import {z} from "zod"
import { ContentType } from "../utils/constant";

export const contentSchema=z.object({
    title:z.string().min(1,{message:"Title cannot be empty"}),
    type:z.enum(ContentType).refine((val)=>ContentType.includes(val) ,{message: `Type must be one of ${ContentType.join(',')}`}),
    tags:z.array(z.string()).max(10,{message:"Tags must be at most 10"}).optional(),
    content:z.string().max(500,{message:"Content Length must be at most 500 characters"}).optional(),
    link:z.preprocess(
        (val)=> typeof val === "string"  && val.trim() === "" ? undefined : val,
        z.string().url({message:"Link must be valid url"}).optional()
    )
})

export type TContentSchema=z.infer<typeof contentSchema>;

export const deleteSchema=z.object({
    contentId:z.string().refine((val)=>mongoose.Types.ObjectId.isValid(val),{message:"Invalid ContentId"})
})

export type TDeleteSchema=z.infer<typeof deleteSchema>

export const updateContentSchema = z.object({
  contentId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid contentId",
  }),
  title:z.string(),
    type:z.enum(ContentType).refine((val)=>ContentType.includes(val) ,{message: `Type must be one of ${ContentType.join(',')}`}),
    tags:z.array(z.string()).max(10,{message:"Tags must be at most 10"}).optional(),
    content:z.string().max(500,{message:"Content Length must be at most 500 characters"}).optional(),
    link:z.preprocess(
        (val)=> typeof val === "string"  && val.trim() === "" ? undefined : val,
        z.string().url({message:"Link must be valid url"}).optional()
    )
});

export type TUpdateContentSchema = z.infer<typeof updateContentSchema>;