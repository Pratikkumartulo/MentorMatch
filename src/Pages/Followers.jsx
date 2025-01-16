import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentService from '../Appwrite/CreateDocument';
import FollowCard from '../Components/FollowCard';

const Followers = () => {
  const [Followers, setFollowers] = useState([]);
  const { slug } = useParams();

  const getFollowers = async () => {
    const followers = await DocumentService.getIdDetails(slug);
    setFollowers(followers.Follower);
  };

  useEffect(() => {
    getFollowers();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">Followers</h2>
      
      {Followers.length > 0 ? (
        <ul className="space-y-4">
          {Followers.map((follower, index) => (
            <li key={index} className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex-1">
                <FollowCard userName={follower}/>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No followers found.</p>
      )}
    </div>
  );
};

export default Followers;