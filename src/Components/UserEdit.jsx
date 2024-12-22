import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import DocumentService from "../Appwrite/CreateDocument";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";

const UserEdit = () => {
  const { slug } = useParams();
  const authStatus = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    Id:"",
    UserName: "",
    Email: "",
    AboutYou: "",
    phone: "",
    SpecializedIn: [],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: userDetails,
  });

  const fetchUserDetails = async () => {
    if (!authStatus) {
      navigate("/login");
      return;
    }

    try {
      const userData = await DocumentService.getEmailDetails(authStatus.email);

      const fetchedDetails = {
        Id:userData.$id || "",
        UserName: userData.UserName || "",
        Email: userData.Email || "",
        AboutYou: userData.AboutYou || "",
        phone: userData.Phone || "",
        SpecializedIn: userData.SpecializedIn || [],
      };

      setUserDetails(fetchedDetails);
      reset(fetchedDetails); // Reset form with fetched data
    } catch (error) {
      toast.error("Failed to fetch user details.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [authStatus]);

  const submit = async (data) => {
    // console.log(data);
    try {
      await DocumentService.updateUserDetails(userDetails.Id, {...data});
      toast.success("Profile updated successfully!");
      navigate(`/user/${slug}`);
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <form
          className="bg-white shadow rounded-lg p-6"
          onSubmit={handleSubmit(submit)}
        >
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="UserName" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="UserName"
              {...register("UserName")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-gray-200 focus:outline-none"
              disabled
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="Email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="Email"
              {...register("Email")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-gray-200 focus:outline-none"
              disabled
            />
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              {...register("phone")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 bg-gray-200 focus:outline-none"
              disabled
            />
          </div>

          {/* About */}
          <div className="mb-4">
            <label htmlFor="AboutYou" className="block text-sm font-medium text-gray-700">
              About You
            </label>
            <textarea
              id="AboutYou"
              {...register("AboutYou")}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            ></textarea>
          </div>

          {/* Specialized */}
        <div className="mb-4">
            <label htmlFor="check" className="block text-sm font-medium text-gray-700 mb-2">
                Specialized In
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Relationship */}
                <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="rel"
                    value="Relationship"
                    {...register("SpecializedIn")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Relationship</span>
                </label>

                {/* Career */}
                <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="career"
                    value="Career"
                    {...register("SpecializedIn")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Career</span>
                </label>

                {/* Education */}
                <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="education"
                    value="Education"
                    {...register("SpecializedIn")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Education</span>
                </label>

                {/* Strategy */}
                <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="strategy"
                    value="Strategy"
                    {...register("SpecializedIn")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Strategy</span>
                </label>

                {/* Leadership */}
                <label className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    id="leadership"
                    value="Leadership"
                    {...register("SpecializedIn")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Leadership</span>
                </label>
            </div>
        </div>


          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
        <Toaster />
      </main>
    </div>
  );
};

export default UserEdit;
