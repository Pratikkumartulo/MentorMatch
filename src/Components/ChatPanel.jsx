import React, { useState, useEffect,useRef } from "react";
import { useParams } from "react-router-dom";
import ChatService from "../Appwrite/ChatService";
import DocumentService from "../Appwrite/CreateDocument";


const ChatPanel = () => {
    const messagesEndRef = useRef(null);
    const { slug } = useParams();
    const [username1, username2] = slug.split("_");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const chatRoomId1 = `${username1}_${username2}`;
    const chatRoomId2 = `${username2}_${username1}`;

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const chatHistory1 = await ChatService.fetchChatHistory(chatRoomId1);
                const chatHistory2 = await ChatService.fetchChatHistory(chatRoomId2);
                await DocumentService.updateUserChatDetails(username1, username2);

                const combinedMessages = [...chatHistory1, ...chatHistory2].sort(
                    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
                );

                setMessages(combinedMessages);
            } catch (error) {
                console.error("Error fetching chat history:", error);
            }
        };

        fetchChatHistory();
    }, [chatRoomId1, chatRoomId2]);

    useEffect(() => {
        const unsubscribe1 = ChatService.subscribeToChatUpdates(chatRoomId1, (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage].sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            ));
        });

        const unsubscribe2 = ChatService.subscribeToChatUpdates(chatRoomId2, (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage].sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            ));
        });

        return () => {
            if (unsubscribe1) unsubscribe1();
            if (unsubscribe2) unsubscribe2();
        };
    }, [chatRoomId1, chatRoomId2]);
    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (newMessage.trim()) {
            const messageData = {
                chatRoomId: chatRoomId1,
                message: newMessage,
                senderId: username1,
                receiverId: username2,
                timestamp: new Date().toISOString(),
            };

            try {
                await ChatService.createMessage(messageData);
                setNewMessage("");
            } catch (error) {
                console.error("Error sending message:", error);
            }
        }
    };

    return (
        <main className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <header className="bg-blue-600 text-white py-4 px-6 shadow-lg">
                <h1 className="text-lg font-bold">{`Chat with ${username2}`}</h1>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-scroll p-4 max-h-[70vh] bg-red-200">
                {messages.length > 0 ? (
                    <div className="space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.$id || message.id}
                                className={`flex ${message.senderId === username1
                                    ? "justify-end"
                                    : "justify-start"
                                    }`}
                            >
                                <div
                                    className={`max-w-sm px-4 py-2 rounded-lg ${message.senderId === username1
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300 text-black"
                                        }`}
                                >
                                    {message.message}
                                </div>
                                <div ref={messagesEndRef}></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-gray-600 mt-10">
                        No messages yet. Start the conversation!
                    </div>
                )}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-300 px-4 py-3 flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                    onClick={handleSend}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                    Send
                </button>
            </div>
        </main>
    );
};

export default ChatPanel;
