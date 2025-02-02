import { useState } from "react";
import React from 'react'
import { useForm } from "react-hook-form";
import authServie from "../Appwrite/UserConfig";
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignUp = () => {
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm({
        defaultValues: {
            name:"",
            password:"",
            phone:"",
            email: "",
            username:""
        },
    });
    const submit = async (data)=>{
        if (data) {
            try {
                const response = await authServie.UserSignUp({ ...data });
                const message = typeof response.msg === "string" ? response.msg : response.msg?.toString() || "An unknown error occurred.";
                toast(message);
                if(response){
                    navigate("/");
                }
            } catch (error) {
                toast(error.message || "Failed to sign up. Please try again.");
            }
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800">Create Your Account</h2>
            <p className="mt-2 text-center text-gray-600">Join Mentor Connect</p>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(submit)}>
            {/* Name Field */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                {...register("name",{required:true})}
                type="text"
                id="name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            {/* Username Field */}
            <div>
                <label htmlFor="user" className="block text-sm font-medium text-gray-700">UserName</label>
                <input
                {...register("username",{required:true,max:10})}
                type="text"
                id="user"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            {/* Email Field */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                {...register("email", { required: true })}
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Password Field */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                {...register("password", { required: true })}
                type="password"
                id="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            {/* Phone No */}
            <div>
                <label htmlFor="phoneno" className="block text-sm font-medium text-gray-700">phoneno</label>
                <input
                {...register("phone", { required: true })}
                type="Number"
                id="phoneno"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
            >
                Sign Up
            </button>
            </form>
            <div className="text-center">Already have an account?<Link to={"/login"}>Login</Link></div>
            <div>
              <Toaster />
            </div>
        </div>
        </div>
    )
}

export default SignUp
