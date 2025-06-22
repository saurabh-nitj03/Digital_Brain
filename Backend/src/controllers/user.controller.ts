import User from "../model/user";
import { signinSchema, signupSchema, TSigninSchema, TSignupSchema } from "../schema/user.schema";
import bcrypt from "bcrypt"
import { JWT_PASSWORD } from "../utils/constant";
import jwt from "jsonwebtoken";

export const signup = async(req : any,res : any)=>{
    try{
        // const {username,password} = req.body;
        const parsed = signupSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(403).json({
                success:false,
                message:parsed.error.issues[0].message
            })
        }
          
        const {username,password , confirmPassword}:TSignupSchema=req.body;
        const user =await User.findOne({username});
        if(user){
            return res.status(403).json({
                success:false,
                message:"User already existed with this username"
            })
        }
        const hashedPassword=await bcrypt.hash(password,2);
        const newUser = await User.create({
            username:username,
            password:hashedPassword
        })
        
        if(!newUser){
            return res.status(403).json({
                success:false,
                message:"User creation failed"
            })
        }
    
        return res.status(201).json({
            success:true,
            message:"user signed up successfully"
        })
    } catch(err){
        return res.status(500).send({
            success:false,
            message:"Something went wrong"
        })
    }
}

export const signin=async(req:any,res:any)=>{
    try{
        const parsed = signinSchema.safeParse(req.body);
        if(!parsed.success){
            return res.status(403).json({
                success:false,
                message:parsed.error.issues[0].message
            })
        }
        const {username,password}:TSigninSchema=req.body;
        const user=await User.findOne({username});
        if(!user){
            return res.status(403).json({
                success:false,
                message:"User doesnot exist"
            })
        }
        const PasswordCorrect=await bcrypt.compare(password,user.password)
        if(!PasswordCorrect){
            return res.status(403).json({
                success:false,
                message:"Password is not correct"
            })
        }
        const token=jwt.sign({id:user._id},JWT_PASSWORD,{
                expiresIn:"1d"
            })
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: true,
            maxAge: 24 * 60 * 60 * 1000 ,
            sameSite: 'strict'
        });
        return res.status(200).json({
                success:true,
                message:"User signed in Successfully",
                token
            })
    } catch(err){
        return res.status(500).json({
            success:false,
            message:"Something went wrong"+err
        })
    }
}

export const signout=async(req:any,res:any)=>{
    try {
        res.cookie("jwt", "", {
            httpOnly: true,
            secure: true,
            expires: new Date(0),
        });
        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
  } catch (error) {
        // console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        });
  }
}

export const check=async(req:any,res:any)=>{
    try{
        res.status(200).json({
        success: true,
        userId:req.userId,
        message: "User is authenticated",});
    } catch (error) {
        res.status(500).json({
            success: false,
            isAuthenticated: false,
            message: "An error occurred while checking authentication",
         });
    }
}