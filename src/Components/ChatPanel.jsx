import React, { useState, useEffect,useRef } from "react";
import { Link, useParams } from "react-router-dom";
import ChatService from "../Appwrite/ChatService";
import DocumentService from "../Appwrite/CreateDocument";
import { useSelector } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { useForm } from "react-hook-form";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ratingService from "../Appwrite/reviewConfig";


const ChatPanel = () => {
    const messagesEndRef = useRef(null);
    const currUser = useSelector((state) => state.auth.userData);
    const { slug } = useParams();
    const [username1, username2] = slug.split("_");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [canRate,setcanRate]=useState(false);
    const [dialogbox,setdialogbox] = useState(false);
    const {register, handleSubmit} = useForm();
    const [ratingValue, setRatingValue] = useState(0);

    const chatRoomId1 = `${username1}_${username2}`;
    const chatRoomId2 = `${username2}_${username1}`;
    const openDialogBox=()=>{
        setdialogbox(prev=>!prev);
    }

    const StyledRating = styled(Rating)(({ theme }) => ({
        '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
          color: theme.palette.action.disabled,
        },
      }));
      
      const customIcons = {
        1: {
          icon: <SentimentVeryDissatisfiedIcon color="error" />,
          label: 'Very Dissatisfied',
        },
        2: {
          icon: <SentimentDissatisfiedIcon color="error" />,
          label: 'Dissatisfied',
        },
        3: {
          icon: <SentimentSatisfiedIcon color="warning" />,
          label: 'Neutral',
        },
        4: {
          icon: <SentimentSatisfiedAltIcon color="success" />,
          label: 'Satisfied',
        },
        5: {
          icon: <SentimentVerySatisfiedIcon color="success" />,
          label: 'Very Satisfied',
        },
      };
      
      function IconContainer(props) {
        const { value, ...other } = props;
        return <span {...other}>{customIcons[value].icon}</span>;
      }
      
      IconContainer.propTypes = {
        value: PropTypes.number.isRequired,
      };

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const chatHistory1 = await ChatService.fetchChatHistory(chatRoomId1);
                const chatHistory2 = await ChatService.fetchChatHistory(chatRoomId2);
                await DocumentService.updateUserChatDetails(username1, username2);
                const rate = await DocumentService.getEmailDetails(currUser.email);
                setcanRate(rate.isUser);
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

    const submit = async (data) => {
        let mentie = await DocumentService.getIdDetails(username2);
        console.log("Submitted Data:", { ...data, ratingValue });
        try {
            await ratingService.rateMentor(mentie.$id,{username:username1,ment:username2,ratingValue,review:data.feedback});
            setdialogbox(false);
        } catch (error) {
            console.error("Error submitting feedback:", error);
        }
     }

    return (
        <main className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <header className="relative bg-blue-600 text-white py-4 px-6 shadow-lg flex justify-between items-center"> 
                <h1 className="text-lg font-bold">
                    <Link to={`/u/${username2}`}>{`${username2}`}</Link></h1>
                {canRate?<button onClick={openDialogBox}>Rate</button>:null}
            </header>
        <div className={`flex flex-col absolute h-fit w-3/4 bg-green-200 top-[25%] left-[50%] translate-x-[-50%] translate-y-[-50%] ${(dialogbox)?null:"hidden"}`}>
            <div className='h-fit w-full bg-green-500 relative'>
                <div className='h-full z-20 w-[100%] text-center text-xl'>
                Feedback !!
                </div>
                <div className='absolute z-10 right-[0] top-[-10%] h-full w-[10%] flex justify-center items-center'>
                <RxCross1 className='text-xl' onClick={openDialogBox}/>
                </div>
            </div>
            <div>
                <form className="p-2 flex flex-col items-center gap-4" onSubmit={handleSubmit(submit)}>
                <StyledRating
                    name="ratings"
                    defaultValue={ratingValue}
                    IconContainerComponent={IconContainer}
                    highlightSelectedOnly
                    onChange={(event, newValue) => {
                        setRatingValue(newValue); // Update rating value state
                    }}
                    />
                <TextField
                    id="outlined-multiline-static"
                    label="Feedback"
                    multiline
                    rows={4}
                    defaultValue=""
                    {...register("feedback")}
                    />
                <Button variant="contained" color="success" type="submit">
                Submit
                </Button>
                </form>
            </div>
        </div>

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
