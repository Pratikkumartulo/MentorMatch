import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DocumentService from "../Appwrite/CreateDocument";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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

  const hanldeConnect = (mentor)=>{
    navigate(`/chat/${currUser}_${mentor}`);
  }

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
              <div
                key={mentor.id}
                className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center"
              >
                <img
                  src="https://via.placeholder.com/100"
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
                onClick={()=>hanldeConnect(mentor.name)}>
                  Connect
                </button>
                <Link to={`/u/${mentor.name}`}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                    visit
                </Link>
              </div>
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
