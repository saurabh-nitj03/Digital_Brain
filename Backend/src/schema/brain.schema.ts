import {z} from "zod"

export const shareSchema=z.object({
    share:z.boolean().default(false)
})
export type TShareSchema=z.infer<typeof shareSchema>

export const getSharedLinkSchema =z.object({
    shareLink:z.string().min(5,{message:"Hash must be of atleast 10 characters"}).max(10,{message:"Hash must be of atmost 10 characters"})
})
export type TGetSharedLinkSchema=z.infer<typeof getSharedLinkSchema>