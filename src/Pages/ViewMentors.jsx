import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DocumentService from "../Appwrite/CreateDocument";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../Components/Card";

const ViewMentor = () => {
  const navigate = useNavigate();
  const userDetail = useSelector((state) => state.auth.userData);
  if(!userDetail){
    navigate("/login");
  }
  const [searchTerm, setSearchTerm] = useState("");
  const {slug} = useParams();
  const [allmentors,setAllmentors] = useState([]);
  const [currUser, setcurrUser] =useState(null);

  const fetchMentor = async(slug)=>{
    const mentor = await DocumentService.getMentor(slug);
    // console.log(mentor);
    let mentors = [];
    mentor.documents.forEach((ment)=>{
      let mentorSet = {};
      mentorSet['id'] = ment.$id,
      mentorSet['name'] = ment.UserName,
      mentorSet['expertise'] = ment.SpecializedIn
      mentorSet['ProfileImage'] = ment.ProfileImage
      mentors.push(mentorSet);
    });
    setAllmentors(mentors);
  }

  useEffect(()=>{
    const fetchUser = async ()=>{
      const user = await DocumentService.getEmailDetails(userDetail.email);
      setcurrUser(user.UserName);
    }
    fetchUser();
    fetchMentor(slug);
  })

  const dummyMentors = [
    {
      id: 1,
      name: "John Doe",
      expertise: ["Web Development", "React", "Node.js"],
      rating: 4.8,
    },
    {
      id: 2,
      name: "Jane Smith",
      expertise: ["Data Science", "Python", "Machine Learning"],
      rating: 4.7,
    },
    {
      id: 3,
      name: "Alice Johnson",
      expertise: ["UI/UX Design", "Figma", "Adobe XD"],
      rating: 4.6,
    },
    {
      id: 4,
      name: "Bob Brown",
      expertise: ["Cybersecurity", "Ethical Hacking", "Networking"],
      rating: 4.9,
    },
  ];

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  

  const filteredMentors = allmentors.filter(
    (mentor) =>
      mentor.name.toLowerCase().includes(searchTerm) ||
      mentor.expertise.some((skill) =>
        skill.toLowerCase().includes(searchTerm)
      )
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-lg">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mentors for {slug}</h1>
        </div>
      </header>

      {/* Search Bar */}
      <div className="container mx-auto px-4 py-6">
        <input
          type="text"
          id="SearchBar"
          placeholder="Search mentors by name or expertise..."
          className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring focus:border-blue-500"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Mentor List */}
      <div className="container mx-auto px-4">
        {filteredMentors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMentors.map((mentor) => (
              <Card mentor={mentor} key={mentor.name}/>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-700">No mentors found.</div>
        )}
      </div>
    </div>
  );
};

export default ViewMentor;
