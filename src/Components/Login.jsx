import { useForm } from "react-hook-form";
import React from "react";
import authServie from "../Appwrite/UserConfig";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { StatusDone,StatusFailure } from "../store/ToastSlice";
import { login } from "../store/AuthSlice";
import LogoutButton from "./LogoutBtn";
import { Link, useNavigate } from 'react-router-dom'


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submit = async (data) => {
    if (data) {
      try {
        // try{
        //   await authServie.logout();
        // }catch(err){
        //   null;
        // }
        const response = await authServie.Userlogin({ ...data });
        if(response){
          const message =
            typeof response.msg === "string"
              ? response.msg
              : response.msg?.toString() || "Login Successful!";
          dispatch(StatusDone(message));
          const userData = await authServie.getCurrentUser()
          if(userData) {
            const payload = {
              ...userData,
              isAdmin: false,
            };
            dispatch(login(payload))
          }
          navigate("/")
        }
      } catch (error) {
        dispatch(StatusFailure("Login Error !!"));
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Login</h2>
        <p className="mt-2 text-center text-gray-600">Welcome back to Mentor Connect</p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(submit)}>
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Login
          </button>
        </form>
        <div className="text-center">Dont have an account?<Link to={"/signup"}>Sign up</Link></div>
        <div>
          <Toaster />
        </div>
      </div>
      <LogoutButton/>
    </div>
  );
};

export default Login;