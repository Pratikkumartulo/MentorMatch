import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import fileService from '../Appwrite/uploadFile';
import { useSelector } from 'react-redux';
import DocumentService from '../Appwrite/CreateDocument';

const Card = ({ mentor }) => {
    const navigate = useNavigate();
    const userDetail = useSelector((state) => state.auth.userData);
    const [currUser, setcurrUser] =useState(null);
    const hanldeConnect = (mentor)=>{
        console.log(mentor);
        navigate(`/chat/${currUser}_${mentor}`);
    }
    const [src,setSrc] =useState(null);
    const ProfileImage = async()=>{
        if(mentor.ProfileImage){
            let link = await fileService.getFilePreview(mentor.ProfileImage);
            setSrc(link);
        }
    }
    useEffect(()=>{
        const fetchUser = async ()=>{
            const user = await DocumentService.getEmailDetails(userDetail.email);
            setcurrUser(user.UserName);
        }
        fetchUser();
        ProfileImage();
    },[])
    return (
        <div
            key={mentor.id}
            className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center"
        >
            <img
                src={src?src:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                alt={mentor.name}
                className="w-24 h-24 rounded-full mb-4 border-2 border-blue-600"
            />
            <h2 className="text-lg font-bold text-center">{mentor.name}</h2>
            <p className="text-gray-600 text-sm text-center">
                {mentor.expertise.join(", ")}
            </p>
            {/* <p className="text-yellow-500 text-sm">Rating: {mentor.rating}</p> */}
            <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => hanldeConnect(mentor.name)}>
                Connect
            </button>
            <Link to={`/u/${mentor.name}`}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                visit
            </Link>
        </div>
    )
}

export default Card