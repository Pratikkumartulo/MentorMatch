import React, { useEffect, useState, useSyncExternalStore } from 'react'
import DocumentService from '../Appwrite/CreateDocument'
import fileService from '../Appwrite/uploadFile';

const FollowCard = ({userName}) => {
    const [src,setSrc] = useState(null);
    const getDetails = async()=>{
        let detail = await DocumentService.getIdDetails(userName);
        if(detail.ProfileImage!=null){
            let link = await fileService.getFilePreview(detail.ProfileImage);
            setSrc(link);
        }else{
            setSrc(null);
        }
    }
    useEffect(()=>{
        getDetails();
    },[]);
    // console.log(src);
  return (
    <div className="flex-1 flex justify-between items-center ">
        <img className='w-20 rounded-full' src={src?src:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="img" />
        <span className="text-lg font-medium text-gray-700">{userName}</span>
    </div>
  )
}

export default FollowCard
