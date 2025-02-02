import React, { useEffect, useRef, useState } from 'react';
import communityServices from '../Appwrite/Community';
import { useSelector } from 'react-redux';
import DocumentService from '../Appwrite/CreateDocument';

const Community = () => {
    const currUser = useSelector((state) => state.auth.userData);
    const messagesEndRef = useRef(null);
    const [presUser, setpresUser] = useState(null)
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    // console.log(currUser)

    useEffect(() => {
        const fetchUser = async () => {
            const user = await DocumentService.getEmailDetails(currUser.email)
            setpresUser(user.UserName)
            // console.log(user)
        }
        const fetchChat = async () => {
            const chats = await communityServices.fetchChatHistory()
            setMessages(chats)
        }
        fetchUser()
        fetchChat()
        // console.log(messages)
    })

    useEffect(() => {
        const unsubscribe = communityServices.subscribeToChatUpdates((newMessage) => {
            setMessage((prevMessages) => [...prevMessages, newMessage].reverse())
        })

        return () => {
            if (unsubscribe) unsubscribe();
        }
    })
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        console.log(presUser);
        if (newMessage.trim()) {
            const messageData = {
                message: newMessage,
                from: presUser,
            };

            try {
                await communityServices.createMessage(messageData);
                setNewMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
        console.log(messages)
    };

    return (
        <div className="bg-[#F6F6F6] h-[90vh] flex flex-col items-center p-4">
            {/* Header */}
            <header className="w-full bg-[#161D6F] text-white text-center py-4 rounded-md shadow-md mb-4">
                <p className="text-sm">Share your thoughts with mentors and users!</p>
            </header>

            {/* Chat Area */}
            <div className="flex-1 w-full bg-[#C7FFD8] rounded-md shadow-lg overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-scroll p-4 space-y-4">
        {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
        ) : (
            <div className='flex flex-col h-full'>
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-md ${
                            msg.from === presUser ? "bg-[#98DED9] text-right ml-auto mb-2" : "bg-white mb-2"
                        }`}
                        style={{ maxWidth: "70%" }}
                    >
                        <strong>{msg.from}:</strong>
                        <p>{msg.message}</p>
                    </div>
                ))}
                {/* Scroll to bottom reference */}
                </div>
                )}
            </div>
                <div ref={messagesEndRef}></div>

                {/* Message Input */}
                <div className="bg-[#98DED9] p-4 flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#161D6F]"
                    />
                    <button
                        onClick={handleSend}
                        className="bg-[#161D6F] text-white px-4 py-2 rounded-md hover:bg-[#0f1453] transition"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Community;
