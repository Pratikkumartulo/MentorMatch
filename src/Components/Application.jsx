import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DocumentService from "../Appwrite/CreateDocument";
import { useSelector } from "react-redux";
import ApplicationService from "../Appwrite/Applicationconfig";

const Application = () => {
    const {slug} = useParams();
    // console.log(slug);
    const authStatus = useSelector((state) => state.auth.userData);
    const navigate = useNavigate();
    
    const [isvalid,setisvalid] = useState(true);
    const [userDetails, setUserDetails] = useState({
        Id:"",
        UserName: "",
        Email: "",
        AboutYou: "",
        phone: "",
        SpecializedIn: [],
        isUser:true,
    });
    
   const { register, handleSubmit, reset } = useForm({
    defaultValues: userDetails,
   });
  const fetchUserDetails = async () => {
    if (!authStatus) {
      navigate("/login");
      return;
    }
    try {
      const userData = await DocumentService.getEmailDetails(authStatus.email);
      // console.log(userData);
      const fetchedDetails = {
        Id:userData.$id || "",
        UserName: userData.UserName || "",
        Email: userData.Email || "",
        AboutYou: userData.AboutYou || "",
        phone: userData.Phone || "",
        SpecializedIn: userData.SpecializedIn || [],
        isUser:userData.isUser,
      };
      setUserDetails(fetchedDetails);
      reset(fetchedDetails);
    } catch (error) {
      toast.error("Failed to fetch user details.");
      // console.error(error);
    }
  };
  // const validUser = async()=>{
  //   const response = await ApplicationService.GetdetailApplications(userDetails.Email);
  //   console.log(response.documents);
  //   if(response.documents.length>0){
  //     console.log("yesssss")
  //     // setisvalid(false);
  //   }
  //   console.log(userDetails)
  //   if(!userDetails.isUser){
  //     console.log("test")
  //     // setisvalid(false);
  //   }
  //   console.log(isvalid)
  // }
  // validUser();
  useEffect(() => {
    fetchUserDetails();
    const validUser = async () => {
      try {
        const response = await ApplicationService.GetdetailApplications(userDetails.Email);
        // console.log(response.documents);
        if (response.documents.length > 0 || !userDetails.isUser) {
          setisvalid(false);
        } else {
          setisvalid(true);
        }
        // console.log("Validation complete");
      } catch (error) {
        console.error("Validation failed", error);
        setisvalid(false);
      }
    };
  
    if (userDetails.Email) {
      validUser();
    }
  }, [userDetails]);
  

  const onSubmit = (data) => {
    // console.log(data);
    const status = ApplicationService.CreateApplication({UserName:data.UserName,Email:data.Email,UserId:data.Id,message:data.message,subject:data.subject});
    if(status){
      toast.success("Submitted successfully")
      reset();
    }else{
      toast.error("Some error occured !!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Apply to Mentor
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              {...register("UserName", { required: true })}
              placeholder="Enter your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              {...register("Email", { required: true })}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled
            />
          </div>

          {/* Subject */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              {...register("subject", { required: true })}
              placeholder="Enter the subject (e.g., Career Guidance)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Application Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Application Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              {...register("message", { required: true })}
              rows="5"
              placeholder="Write your message explaining why you want to connect with the mentor"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          {(isvalid)?
          (
          <button
            type="submit"
            className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Application
          </button>
          ):(
            !(userDetails.isUser)?
            (
              <div className="text-center w-full py-2 text-white bg-blue-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
              You are already a mentor !
            </div> 
            ):
            (
            <div className="text-center w-full py-2 text-white bg-blue-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
              Your application is in pending
            </div>
            )
          )}
        </form>

        {/* Toast Notifications */}
        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default Application;
