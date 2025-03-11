import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DocumentService from "../Appwrite/CreateDocument";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ratingService from "../Appwrite/reviewConfig";
import fileService from "../Appwrite/uploadFile";

const User = () => {
  const authStatus = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const { slug } = useParams();
  const [ratings,setRatings] = useState([]);
  const [myRating,setmyRating] = useState([]);
  const [src,setSrc] = useState(null)
 
  const [userDetails, setUserDetails] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Web Developer | JavaScript Enthusiast | Lifelong Learner",
    skills: ["JavaScript", "React", "Node.js", "CSS"],
    isUser:true,
    followers:0,
    followings:0,
    ProfileImage:null,
    Follower:[],
    Following:[],
  });

  const fetchMyReviews=async()=>{
    const reviews = await ratingService.getMyReviews(userDetails.UserName);
    setRatings(reviews);
    const myreviews = await ratingService.getReviews(userDetails.UserName);
    setmyRating(myreviews)
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
        if (!slug) {
            navigate("/login");
            return;
        }
        if (authStatus && slug === authStatus.userData.$id) {
            try {
                console.log(authStatus.userData);
                setUserDetails(authStatus.userData);

                if (authStatus.userData.ProfileImage != null) {
                    let link = await fileService.getFilePreview(authStatus.userData.ProfileImage);
                    setSrc(link);
                } else {
                    setSrc(null);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        } else {
            navigate("/login");
        }
    };

    const fetchData = async () => {
        await fetchUserDetails();
        await fetchMyReviews();
    };

    fetchData();
}, [slug, navigate]);  // ✅ Fix: Correct dependencies


  if (!authStatus) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const user = {
    name: userDetails.UserName,
    email: userDetails.Email,
    bio: userDetails.AboutYou,
    skills: userDetails.SpecializedIn,
    isUser:userDetails.isUser,
    ProfileImage:src,

  };
  // console.log(user.ProfileImage);
  fetchMyReviews();
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between align-center">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <div className="p-2 rounded-lg bg-red-500">
          <Link to={`/user/${authStatus.userData.$id}/edit`}>
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
                src={user.ProfileImage?user.ProfileImage:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
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
                <div> <Link to={`/u/${user.name}/followers`}>Followers</Link></div>
              </div>
              <div>
                <div className="flex justify-center items-center flex-col">
                  <div>{userDetails.Following.length}</div>
                  <div><Link to={`/u/${user.name}/followings`}>Followings</Link></div>
                </div>
              </div>
            </div>):
            (<div className="flex justify-center items-center flex-col">
              <div>{(userDetails.Following==undefined)?0:userDetails.Following.length}</div>
              <div><Link to={`/u/${user.name}/followings`}>Followings</Link></div>
            </div>)}
            {!(user.isUser)?null:(<Link to={`/user/${authStatus.userData.$id}/application`} className="bg-green-500 p-1 rounded-lg">Be a mentor</Link>)}
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
        <section className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-bold mb-3">Ratings by me</h3>
              <ul className="list-disc pl-5 text-gray-700">
                {(ratings.length)>0
                  ?(
                  <div className="flex gap-4 flex-wrap">{
                    ratings.map((rate,index)=>(
                      <div key={index} className="p-4 rounded-lg flex flex-col gap-2 flex-wrap bg-zinc-300 w-fit">
                      <ul className="list-none">
                        <Link to={`/u/${rate.ratingTo}`}><li className="font-bold">To : {rate.ratingTo}</li></Link>
                          <li>{rate.rating} ⭐</li>
                          <li>{rate.review}</li>
                      </ul>
                      </div>
                      ))
                    }</div>
                    ) : (
                      <li>No Reviews.</li>
                    )}
                  </ul>
        </section>
        {!(userDetails.isUser)?
              <section className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-bold mb-3">Ratings</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                  {(myRating.length)>0
                    ?(
                      <div className="flex gap-4 flex-wrap">{
                        myRating.map((rate,index)=>(
                        <div key={index} className="p-4 rounded-lg flex flex-col gap-2 flex-wrap bg-zinc-300 w-fit">
                          <ul className="list-none">
                            <Link to={`/u/${rate.ratedBy}`}><li className="font-bold">{rate.ratedBy}</li></Link>
                            <li>{(rate.rating).toFixed(1)} ⭐</li>
                            <li>{rate.review}</li>
                          </ul>
                        </div>
                      ))
                    }</div>
                    ) : (
                      <li>No review yet.</li>
                    )}
                  </ul>
              </section>
            :null}
      </main>
    </div>
  );
};

export default User;