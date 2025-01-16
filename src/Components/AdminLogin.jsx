import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import AdminauthServie from "../Appwrite/Adminconfig"; 
import { login,logout } from "../store/AuthSlice";
import { useDispatch } from "react-redux";

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Mock admin login details (replace with backend authentication in production)

  // Handle login submission
  const onSubmit = async (data) => {
    try{
      await AdminauthServie.logout();

    }catch(err){
      null;
    }
    const admin = await AdminauthServie.Adminlogin({...data});
    // console.log(admin);
    const adminData = await AdminauthServie.getCurrentAdmin();
    if(adminData.labels.includes('admin')){
      const payload = {
        ...adminData,
        isAdmin: true,
      };
      dispatch(login(payload));
      navigate('/admin');
    }
    else{
      toast.error("Invalid credentials !")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              email
            </label>
            <input
              {...register("email", { required: "email is required" })}
              type="email"
              id="email"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.username && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              {...register("password", { required: "Password is required" })}
              type="password"
              id="password"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Login
          </button>
        </form>
        <Toaster />
      </div>
    </div>
  );
};

export default AdminLogin;