import { Button } from "../components/Button"
import { Input } from "../components/CreateContentModal"
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {z} from "zod";
import type { SubmitHandler } from "react-hook-form";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const signupSchema=z.object({
    username:z.string().min(1,{message:"Username cannot be empty"}),
    password:z.string().min(5,{message:"Password must be atleast 5 characters"}),
    confirmPassword:z.string().min(5,{message:"Password must be atleast 5 characters"}),
}).refine((data)=> data.password === data.confirmPassword,{
    message:"Password and Confirm Password does not match",
    path:["confirmPassword"],
})

type TSignupSchema = z.infer<typeof signupSchema>;
export default function Signup() {
    const [loading,setLoading]=useState(false); 

    const {register, handleSubmit,formState:{errors}}=useForm<TSignupSchema>({
          resolver:zodResolver(signupSchema)
    })
    const [error , setError]=useState<string | null>(null)
    const navigate=useNavigate();
    const onSubmit:SubmitHandler<TSignupSchema>=async(data)=>{
        // console.log(data);  
        setLoading(true);
        try{
           const response = await axios.post(BACKEND_URL+"/api/v1/signup",data,{withCredentials:true})
           if(response.data.success){
              const responseFromSignIn=await axios.post(BACKEND_URL+"/api/v1/signin",{
                username:data.username,
                password:data.password
              },{withCredentials:true})
              if(!responseFromSignIn.data.success){
                setError(responseFromSignIn.data.message || "Signup done... SignIn Failed")
                setLoading(false);
                navigate("/signin");
            } else {
                  setLoading(false);
                  navigate("/dashboard");
                }
            } else{
                setError(response.data.message || "SignUp Failed");
            }
        } catch(err){
              setLoading(false);
            if(axios.isAxiosError(err)){
                setError(err.response?.data?.message || "SignUp error due to server error")
            } else{
                setError(
                    "An unexpected error ocurred"
                )
            }
          }
    }
    return <div className="h-screen w-screen flex flex-col  ">
            <Navbar/>
            <div className="flex justify-center  h-full w-full bg-purple-50 ">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-56 sm:w-96 flex flex-col mt-24 transiton-all duration-500  ">
                        <div>
                            <div className="text-3xl font-semibold  mb-2">
                            Sign Up
                            </div>
                        </div>
                        <Input  placeholder="Enter username" {...register("username")} width={true} />
                        {errors.username && (
                        <p className=" text-sm text-red-600">{errors.username.message}</p>
                       )}
                        <Input placeholder="Enter password" {...register("password")} width={true} />
                        {errors.password && (
                        <p className=" text-sm text-red-600">{errors.password.message}</p>
                        )}
                        <Input placeholder="Confirm password" {...register("confirmPassword")} width={true} />
                        {errors.confirmPassword && (
                        <p className=" text-sm text-red-600">{errors.confirmPassword.message}</p>
                        )}
                    <span className="mb-3 ">  Already have an account ? <span className="text-purple-600 cursor-pointer" onClick={()=>navigate("/signin")}>Sign in</span>  </span>
                        <Button type="submit" variant="primary" text={loading ? "Creating Account..." : "Sign Up"} size="md" width={true} rounded={true} />
                    {error && (
                        <p className="mt-2 text-sm text-red-600 text-center w-full">{error}</p>
                    )}
                    </div>

                </form>
            </div>
            <Footer/>
    
        </div>
}