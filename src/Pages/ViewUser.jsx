import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DocumentService from "../Appwrite/CreateDocument";
import { current } from "@reduxjs/toolkit";
import toast from "react-hot-toast/headless";
import ratingService from "../Appwrite/reviewConfig";
import { Link } from "react-router-dom";
import fileService from "../Appwrite/uploadFile";


const ViewUser = () => {
  const authStatus = useSelector((state) => state.auth.userData);
  const navigate = useNavigate();
  const { slug } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currUserName,setcurrUserName] = useState(null);
  const [currUserId,setcurrId] = useState(null);
  const [isFollow,setisFollow] = useState(false);
  const [ratings,setRatings] = useState([]);
  const [src,setSrc] = useState(null);

  const getUsername = async()=>{
    const curUser = await DocumentService.getEmailDetails(authStatus.email);
    if(!isAdmin){
        if(curUser.Following.includes(userDetails.UserName)){
            setisFollow(true);
        }else{
            setisFollow(false);
        }
        setcurrUserName(curUser.UserName);
        setcurrId(curUser.$id);
    }
   }
   const fetchUserDetails = async () => {
    try {
      const userData = await DocumentService.getIdDetails(slug);
      // console.log(userData);
      if(authStatus.$id===userData.UserID){
          navigate(`/user/${authStatus.$id}`);
      }
      if(userData.ProfileImage!=null){
        let link = await fileService.getFilePreview(userData.ProfileImage);
        setSrc(link);
      }else{
        setSrc(null);
      }
      setUserDetails(userData);
    } catch (error) {
      console.error("Error fetching user details:", error);
      // navigate("/404"); // Redirect to a 404 page if user is not found
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async()=>{
    const reviews = await ratingService.getReviews(slug);
    setRatings(reviews);
    // console.log(ratings);
    // setUserDetails({...userDetails,ratings:reviews});
  }

  useEffect(() => {
    getUsername();
    fetchReviews();
    if (authStatus && authStatus.userData.labels?.includes("admin")) {
        setIsAdmin(true);
    }
    fetchUserDetails();
  }, [userDetails]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: User not found.
      </div>
    );
  }

  const user = {
    name: userDetails.UserName || "N/A",
    email: userDetails.Email || "N/A",
    bio: userDetails.AboutYou || "No bio available.",
    skills: userDetails.SpecializedIn || [],
    isUser: userDetails.isUser,
    followers: userDetails.Follower?.length || 0,
    followings: userDetails.Following?.length || 0,
    ratings:userDetails.ratings || [],
    ProfileImage:src,
  };
  // console.log(user.ProfileImage);

  const calculaterate = ()=>{
    if(user.ratings.length>0){
        let sum = 0;
        user.ratings.map((rate)=>{
            sum+=rate;
        });
        return (sum/user.ratings.length).toFixed(1);
      }else{
        return "No ratings yet";
      }
    }

  const HandleFollow = async (slug,{UserName, currentId})=>{
    const isFollowed = await DocumentService.follow(slug,{UserName, currentId});
    if(isFollowed){
        toast.success("Successfully followed");
    }else{
        toast.error("Some error occured !!");
    }
  }
  const HandleUnFollow = async (slug,{UserName, currentId})=>{
    const isFollowed = await DocumentService.unfollow(slug,{UserName, currentId});
    if(isFollowed){
        toast.success("Successfully unfollowed");
    }else{
        toast.error("Some error occured !!");
    }
  }

  const handleGrant = async(val)=>{
    const response = await DocumentService.updateUserAppDetails(userDetails.$id,{isUser:val});
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">View Profile</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-500 px-4 py-2 rounded-lg text-white hover:bg-red-600"
          >
            Go Back
          </button>
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
                {!(userDetails.isUser)?<p className="mb-2 bg-zinc-300 rounded-lg px-2 w-fit">
                  {calculaterate()}  ⭐
                </p>:null}
                {(isAdmin)?(!userDetails.isUser)?(<button className="p-0.5 rounded-lg bg-red-500" onClick={()=>handleGrant(true)}>Revoke</button>):<button onClick={()=>handleGrant(false)} className="rounded-lg p-0.5 bg-green-500">Grant</button>:null}
              </div>
            </div>
            <div className="flex gap-3">
              {!(userDetails.isUser)?(<div className="flex flex-col items-center">
                <div>{user.followers}</div>
                <div><Link to={`followers`}>Followers</Link></div>
              </div>):null}
              <div className="flex flex-col items-center">
                <div>{user.followings}</div>
                <div><Link to={`followings`}>Followings</Link></div>
                {!(isAdmin)?!(userDetails.isUser)?!(isFollow)?<button onClick={() => HandleFollow(userDetails.$id, { UserName: currUserName, currentId: currUserId })} className="bg-blue-500 text-sm px-2 rounded-sm">Follow</button>:<button onClick={() => HandleUnFollow(userDetails.$id, { UserName: currUserName, currentId: currUserId })} className="bg-red-500 text-white text-sm px-2 rounded-sm">Unfollow</button>:null:null}
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        <section className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-bold mb-3">About</h3>
          <p className="text-gray-700">{user.bio}</p>
        </section>

        {/* Skills Section */}
        <section className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">Skills</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {user.skills.length > 0 ? (
              user.skills.map((skill, index) => <li key={index}>{skill}</li>)
            ) : (
              <li>No skills listed.</li>
            )}
          </ul>
        </section>
        {!(userDetails.isUser)?
        <section className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">Ratings</h3>
          <ul className="list-disc pl-5 text-gray-700">
          {(ratings.length)>0
            ?(
              <div className="flex gap-4 flex-wrap">{
              ratings.map((rate,index)=>(
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

export default ViewUser;