import React, { useEffect, useState } from "react";
import DocumentService from "../Appwrite/CreateDocument";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";

const ChatPage = () => {
    const navigate = useNavigate();
    const userDetail = useSelector((state) => state.auth.userData);
    const [chats, setChats] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [currUser, setCurrUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // For mobile view toggle

    const getChats = async () => {
        const user = await DocumentService.getEmailDetails(userDetail.email);
        setCurrUser(user.UserName);
        let ChatsWiths = [];
        for (const element of user.ChatsWith) {
            let usr = await DocumentService.getIdDetails(element);
            ChatsWiths.push({ name: usr.UserName, id: usr.$id });
        }
        setChats(ChatsWiths);
    };

    useEffect(() => {
        const fetchChats = async () => {
            await getChats();
        };
        fetchChats();
    }, []);

    const handleMentorClick = (mentorId) => {
        setIsSidebarOpen(false); // Close sidebar on mobile after selection
        navigate(`/chat/${currUser}_${mentorId}`);
    };

    return (
        <div className="flex flex-col h-[90vh] overflow-y-hidden lg:flex-row bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`absolute lg:relative lg:w-1/4 bg-white shadow-lg border-r h-full transition-transform transform ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <header className="bg-blue-600 text-white py-4 px-6 text-lg font-bold flex justify-between items-center lg:static">
                    Chats
                    <button
                        className="text-white lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        ✕
                    </button>
                </header>
                <div className="p-4 space-y-4 overflow-y-auto">
                    {chats.length > 0 ? (
                        chats.map((mentor) => (
                            <div
                                key={mentor.id}
                                onClick={() => handleMentorClick(mentor.name)}
                                className={`cursor-pointer p-4 rounded-lg border ${
                                    selectedMentor?.id === mentor.id
                                        ? "bg-blue-100 border-blue-500"
                                        : "bg-gray-100 border-gray-300"
                                }`}
                            >
                                <h2 className="font-bold">{mentor.name}</h2>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-600">
                            No previous mentors found.
                        </p>
                    )}
                </div>
            </aside>

            {/* Chat Panel */}
            <div className="flex-1 flex flex-col">
                {/* Mobile Toggle Button */}
                <button
                    className="bg-blue-600 text-white py-2 px-4 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                >
                    Open Chats
                </button>
                <Outlet />
            </div>
        </div>
    );
};

export default ChatPage;
