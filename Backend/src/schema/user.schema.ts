import {z} from "zod";

export const signupSchema=z.object({
    username:z.string().min(1,{message:"Username cannot be empty"}),
    password:z.string().min(5,{message:"Password must be atleast 5 characters"}),
    confirmPassword:z.string().min(5,{message:"Password must be atleast 5 characters"}),
}).refine((data)=> data.password === data.confirmPassword,{
    message:"Password and Confirm Password does not match",
    path:["confirmPassword"],
})

export type  TSignupSchema=z.infer<typeof signupSchema>;

export const signinSchema=z.object({
    username:z.string().min(1,{message:"Username cannot be empty"}),
    password:z.string().min(5,{message:"Password must be atleast 5 characters"}),
})

export type TSigninSchema=z.infer<typeof signinSchema>