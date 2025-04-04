import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import DocumentService from "../Appwrite/CreateDocument";
import ApplicationService from "../Appwrite/Applicationconfig";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const [applications, setApplications] = useState([]);
  const [applicationno, setApplicationsno] = useState(0);
  const [allusers, setAllusers] = useState(0);
  const [mentors, setMentors] = useState(0);
  const [userDeails, setUserDetails] = useState([]);

  const getAllUsers = async () => {
    try {
      const users = await DocumentService.getAllUser();
      setUserDetails(users.documents);
      setAllusers(users.total);
      let mentorCount = 0;
      users.documents.forEach((element) => {
        if (element.isUser === false) {
          mentorCount++;
        }
      });
      setMentors(mentorCount);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const getAllApplications = async () => {
    try {
      const applications = await ApplicationService.GetAllApplications();
      setApplicationsno(applications.length);
      setApplications(applications); // Assuming this gives an array
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await getAllUsers();
      await getAllApplications();
    };

    fetchData();
  }, []);

  // const handleApprove = (id) => {
  //   setApplications((prev) =>
  //     prev.map((app) =>
  //       app.id === id ? { ...app, status: "Approved" } : app
  //     )
  //   );
  //   toast.success("Application approved!");
  // };

  // const handleReject = (id) => {
  //   setApplications((prev) =>
  //     prev.map((app) =>
  //       app.id === id ? { ...app, status: "Rejected" } : app
  //     )
  //   );
  //   toast.error("Application rejected!");
  // };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Admin Panel
        </h1>

        {/* Dashboard Summary */}
        <div className="flex-wrap p-4 w-full bg-zinc-200 rounded-lg gap-3 flex justify-center">
          <div className="h-52 w-52 bg-green-600 rounded-lg gap-4 flex flex-col items-center">
            <h1 className="text-xl text-white font-bold">Users</h1>
            <div className="bg-white h-[50%] w-[50%] flex items-center justify-center rounded-full">
              <h1 className="text-6xl">{allusers}</h1>
            </div>
          </div>

          <div className="h-52 w-52 bg-blue-600 rounded-lg flex gap-4 flex-col items-center">
            <h1 className="text-xl text-white font-bold">Mentors</h1>
            <div className="bg-white h-[50%] w-[50%] flex items-center justify-center rounded-full">
              <h1 className="text-6xl">{mentors}</h1>
            </div>
          </div>

          <div className="h-52 w-52 bg-pink-600 rounded-lg flex gap-4 flex-col items-center">
            <h1 className="text-xl text-white font-bold">Requests</h1>
            <div className="bg-white h-[50%] w-[50%] flex items-center justify-center rounded-full">
              <h1 className="text-6xl">{applicationno}</h1>
            </div>
          </div>

          <div className="h-52 w-52 bg-yellow-600 rounded-lg flex flex-col items-center justify-center">
            <h1 className="text-xl text-white font-bold">Reports</h1>
          </div>
        </div>

        {/* Applications Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6 mt-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Contact</th>
                <th className="px-4 py-2">Label</th>
                <th className="px-4 py-2">Created</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userDeails.map((app, index) => (
                <tr
                  key={app.$id}
                  className={`${
                    index % 2 === 0
                      ? "text-gray-700 border-t hover:bg-gray-100"
                      : "bg-zinc-300"
                  }`}
                >
                  <td className="px-4 py-2">{app.$id}</td>
                  <td className="px-4 py-2">{app.UserName}</td>
                  <td className="px-4 py-2">{app.Email}</td>
                  <td className="px-4 py-2">{app.Phone}</td>
                  <td className="px-4 py-2">
                    {app.isUser ? "User" : "Mentor"}
                  </td>
                  <td className="px-4 py-2">{app.$createdAt}</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <Link to={`/u/${app.UserName}`} className="text-blue-600 underline">
                      Visit profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};

export default AdminPage;
