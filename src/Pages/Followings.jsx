import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentService from '../Appwrite/CreateDocument';
import { useSelector } from 'react-redux';
import toast from "react-hot-toast/headless";
import FollowCard from '../Components/FollowCard';

const Followings = () => {
  const userData = useSelector((state)=>state.auth.userData);
//   console.log(userData);
  const [Followings, setFollowings] = useState([]);
  const [followBtn,setFollowBtn] = useState(false);
  const [currUser,setcurrUser] = useState(null);
  const { slug } = useParams();

  const getCurrentUser = async()=>{
    const user = userData.userData;
    setcurrUser(user);
  }
  const getFollowings = async () => {
    const followers = await DocumentService.getIdDetails(slug);
    if(!userData.userData.labels.includes('admin')){
        if(followers.UserID === userData.$id){
            setFollowBtn(true);
        }else{
            setFollowBtn(false);
        }
    }
    setFollowings(followers.Following);
  };

  useEffect(() => {
    getFollowings();
    getCurrentUser();
  }, [Followings]);

  const HandleUnFollow = async ({UserName})=>{
    let user = await DocumentService.getIdDetails(UserName); 
    const isFollowed = await DocumentService.unfollow(user.$id,{UserName:currUser.UserName, currentId:currUser.$id});
    if(isFollowed){
        toast.success("Successfully unfollowed");
    }else{
        toast.error("Some error occured !!");
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Followings</h2>
      
      {Followings.length > 0 ? (
        <ul className="space-y-4">
          {Followings.map((following, index) => (
            <li key={index} className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex-1 flex gap-4 justify-between items-center ">
                <FollowCard userName={following}/>
                {followBtn?<button onClick={()=>HandleUnFollow({UserName:following})} className='p-0.5 rounded-lg text-red border-red-200 border-2'>Unfollow</button>:null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No followings yet.</p>
      )}
    </div>
  );
};

export default Followings;