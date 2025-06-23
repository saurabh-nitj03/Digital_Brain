import { Button } from "../components/Button"
import { Input } from "../components/CreateContentModal"
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const signinSchema = z.object({
    username: z.string().min(1,{message:"Username cannot be empty"}),
    password: z.string().min(5, { message: "Password must be atleast 5 characters" }),
})

type TSignSchema = z.infer<typeof signinSchema>

export default function Signin() {
    const [error, setError] = useState<string | null>(null);
    const [loading,setLoading]=useState(false); 
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<TSignSchema>({
        resolver: zodResolver(signinSchema)
    })

    const onSubmit: SubmitHandler<TSignSchema> = async (data) => {
        setLoading(true)
        try {
            const response = await axios.post(BACKEND_URL + "/api/v1/signin", data, {
                withCredentials: true,
            })
            if (!response.data.success) {
                setError(response.data.message || "SignIn Failed");
            } else {
                // Save token to localStorage
                console.log("Login response:", response.data); // Debug log
                if (response.data.token) {
                    localStorage.setItem('token', response.data.token);
                    console.log("Token saved:", response.data.token); // Debug log
                } else if (response.data.accessToken) {
                    localStorage.setItem('token', response.data.accessToken);
                    console.log("Access token saved:", response.data.accessToken); // Debug log
                } else {
                    console.log("No token found in response"); // Debug log
                }
                setLoading(false);
                navigate("/dashboard");
            }
        } catch (err) {
            setLoading(false)
            if (axios.isAxiosError(err)) {
                setError("SignIn Failed due to "+err.message);
            } else {
                setError("An unexpected error occurred");
            }
        }
    }
    return <div className="h-screen w-screen flex flex-col  ">
        <Navbar />
        <div className="flex justify-center  h-full w-full bg-purple-50 ">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="w-56 sm:w-96 flex flex-col mt-24 transition-all ease-in-out duration-500  ">
                    <div>
                        <div className="text-3xl font-semibold  mb-2">
                            Sign in
                        </div>
                        <div>
                            or <span className="text-purple-600" onClick={() => navigate("/signup")}> create an account</span>
                        </div>
                    </div>
                    {/* <div  className="text-center text-3xl font-normal p-3">Enter Details</div> */}
                    <Input  {...register("username")} placeholder="Enter username" width={true} rounded={false} />
                    {errors.username && (
                        <p className=" text-sm text-red-600">{errors.username.message}</p>
                    )}
                    <Input {...register("password")} placeholder="Enter password" width={true} rounded={false} />
                    {errors.password && (
                        <p className=" text-sm text-red-600">{errors.password.message}</p>
                    )}
                    <span className="text-purple-600 mb-3 "> Forgotten your password ?</span>

                    <Button type="submit" variant="primary" text={loading ?"Signing..." : "Signin"} size="md" width={true} rounded={true} />
                    {error && (
                        <p className="mt-2 text-sm text-red-600 text-center w-full">{error}</p>
                    )}
                </div>
            </form>
        </div>
        <Footer />

    </div>
}