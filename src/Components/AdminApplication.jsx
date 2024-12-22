import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import DocumentService from "../Appwrite/CreateDocument";
import ApplicationService from "../Appwrite/Applicationconfig";
import { list } from "postcss";
import { Link } from "react-router-dom";

const Adminapplication = () => {
  const [applications, setApplications] = useState([]);
  const [allusers, setAllusers] = useState(0);
  const getAllUsers = async ()=>{
    const users = await DocumentService.getAllUser();
    console.log(users);
    setAllusers(users.total);
  }

  const AllApplication = async()=>{
    const applications = await ApplicationService.GetAllApplications();
    let AppliList = [];
    (applications.documents).forEach((item)=>{
        let ItemSet = {};
        ItemSet['AppId']=item.$id
        ItemSet['id']=item.UserId,
        ItemSet['fullName']=item.UserName,
        ItemSet['email']=item.Email,
        ItemSet['subject']=item.subject,
        ItemSet['message']=item.message,
        ItemSet['status']=item.IsOpen?"Pending":"Closed",
        ItemSet['Accepted']=item.Accepted
        AppliList.push(ItemSet);
        console.log(ItemSet)
    })
    setApplications(AppliList);
  }
  useEffect(() => {
    AllApplication();
    const fetchApplications = async () => {
      getAllUsers();
      const mockData = [
        {
          id: "1",
          fullName: "John Doe",
          email: "john.doe@example.com",
          subject: "Career Guidance",
          message: "I want to seek career advice for a job transition.",
          status: "Pending",
        },
        {
          id: "2",
          fullName: "Jane Smith",
          email: "jane.smith@example.com",
          subject: "Education Help",
          message: "I need guidance on selecting the best university.",
          status: "Pending",
        },
      ];
    };

    fetchApplications();
  }, [applications,AllApplication]);

  const handleApprove = async(id,userid,email) => {
    const response = await ApplicationService.updateApplicationDetails(id,{IsOpen:false,Accepted:true});
    const userResponse = await DocumentService.updateUserAppDetails(userid,{isUser:false});
    console.log(response);
    AllApplication();
  };

  const handleReject = async(id) => {
    const response = await ApplicationService.updateApplicationDetails(id,{IsOpen:false,Accepted:false});
    console.log(response);
    AllApplication();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-6">
          Request Panel
        </h1>
        {/* Applications Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-6">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Subject</th>
                <th className="px-4 py-2">Message</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app.AppId}
                  className="text-gray-700 border-t hover:bg-gray-100"
                >
                  <td className="px-4 py-2">{app.id}</td>
                  <td className="px-4 py-2">{app.fullName}</td>
                  <td className="px-4 py-2">{app.email}</td>
                  <td className="px-4 py-2">{app.subject}</td>
                  <td className="px-4 py-2">{app.message}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 text-sm font-medium rounded ${
                        (app.Accepted)
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {app.status}
                      {(app.status==="Closed")?(app.Accepted)?<span className="text-green-600"> - Accepted</span>:<span className="text-red-600"> - Rejected</span>:null}
                    </span>
                  </td>
                  <td className="px-4 items-start gap-4 py-2 flex flex-col space-x-2">
                    <div className="flex gap-2">
                    {app.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleApprove(app.AppId,app.id)}
                          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(app.AppId)}
                          className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    </div>
                    <div>
                    <Link to={`/u/${app.fullName}`} className="p-2 text-white bg-blue-600 rounded hover:bg-green-700">View</Link>
                    </div>
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

export default Adminapplication;
