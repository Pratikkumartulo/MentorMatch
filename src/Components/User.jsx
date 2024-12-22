import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DocumentService from "../Appwrite/CreateDocument";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const User = () => {
  const authStatus = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const { slug } = useParams();
 
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Web Developer | JavaScript Enthusiast | Lifelong Learner",
    skills: ["JavaScript", "React", "Node.js", "CSS"],
    isUser:true,
    followers:0,
    followings:0,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!slug) {
        navigate("/login");
        return;
      }

      if (authStatus && slug === authStatus.$id) {
        try {
          const userData = await DocumentService.getEmailDetails(authStatus.email);
          setUserDetails(userData); // Set fetched user details in state
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      } else {
        navigate("/login");
      }
    };

    fetchUserDetails();
  }, [slug, authStatus, navigate,userDetails]);
  if (!authStatus) {
    return <p>Loading...</p>;
  }

  const user = {
    name: userDetails.UserName,
    email: userDetails.Email,
    bio: userDetails.AboutYou,
    skills: userDetails.SpecializedIn,
    isUser:userDetails.isUser,
  };
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between align-center">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <div className="p-2 rounded-lg bg-red-500">
          <Link to={`/user/${authStatus.$id}/edit`}>
          Edit</Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* User Info */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex-wrap flex items-center justify-between gap-4">
            <div>
              <img
                src="https://via.placeholder.com/100"
                alt="User Avatar"
                className="w-24 h-24 rounded-full border-2 border-blue-600"
              />
              <div>
                <h2 className="text-xl font-bold">{user.name}</h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            {!(user.isUser)?
            (<div className="flex wrap gap-3">
              <div className="flex justify-center items-center flex-col">
                <div>{userDetails.Follower.length}</div>
                <div>Followers</div>
              </div>
              <div>
                <div className="flex justify-center items-center flex-col">
                  <div>{userDetails.Following.length}</div>
                  <div>Following</div>
                </div>
              </div>
            </div>):
            (<div className="flex justify-center items-center flex-col">
              <div>{(userDetails.Following==undefined)?0:userDetails.Following.length}</div>
              <div>Following</div>
            </div>)}
            {!(user.isUser)?null:(<Link to={`/user/${authStatus.$id}/application`} className="bg-green-500 p-1 rounded-lg">Be a mentor</Link>)}
          </div>
        </div>

        {/* Bio Section */}
        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-3">About Me</h3>
          <p className="text-gray-700">{user.bio}</p>
        </section>

        {/* Skills Section */}
        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-3">Skills</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {(user.skills)?(user.skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))):null}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default User;
