import React, { useState } from "react";

const ChatPage = () => {
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([
        // Dummy messages for UI testing
        { id: 1, sender: "user", content: "Hello, how can I help you today?" },
        { id: 2, sender: "mentor", content: "Hi, I have a question about React." },
        { id: 3, sender: "user", content: "Sure, feel free to ask." },
    ]);

    const handleSend = () => {
        if (newMessage.trim()) {
            const newMsg = { id: Date.now(), sender: "user", content: newMessage };
            setMessages([...messages, newMsg]);
            setNewMessage(""); // Clear the input
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-blue-600 text-white py-4 px-6 shadow-lg">
                <h1 className="text-lg font-bold">Chat with Mentor</h1>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.sender === "user" ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`max-w-sm px-4 py-2 rounded-lg ${
                                    message.sender === "user"
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-300 text-black"
                                }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-300 px-4 py-3 flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSend}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatPage;
