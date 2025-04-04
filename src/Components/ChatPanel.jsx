import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import ChatService from "../Appwrite/ChatService";
import DocumentService from "../Appwrite/CreateDocument";
import { useSelector, useDispatch } from "react-redux";
import { RxCross1 } from "react-icons/rx";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Rating from "@mui/material/Rating";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAltOutlined";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import ratingService from "../Appwrite/reviewConfig";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { setVideoId } from "../store/VideoSlice";
import VideoConference from "./VideoConference";

const ChatPanel = () => {
  const messagesEndRef = useRef(null);
  const currUser = useSelector((state) => state.auth.userData);
  const { slug } = useParams();
  const [username1, username2] = slug.split("_");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [canRate, setCanRate] = useState(false);
  const [dialogbox, setDialogbox] = useState(false);
  const [videoPopup, setVideoPopup] = useState(false);
  const { register, handleSubmit } = useForm();
  const [ratingValue, setRatingValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [videoRoomID, setVideoRoomID] = useState("");
  const [videoKey, setVideoKey] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const chatRoomId1 = `${username1}_${username2}`;
  const chatRoomId2 = `${username2}_${username1}`;

  const StyledRating = styled(Rating)(({ theme }) => ({
    "& .MuiRating-iconEmpty .MuiSvgIcon-root": {
      color: theme.palette.action.disabled,
    },
  }));

  const customIcons = {
    1: { icon: <SentimentVeryDissatisfiedIcon color="error" />, label: "Very Dissatisfied" },
    2: { icon: <SentimentDissatisfiedIcon color="error" />, label: "Dissatisfied" },
    3: { icon: <SentimentSatisfiedIcon color="warning" />, label: "Neutral" },
    4: { icon: <SentimentSatisfiedAltIcon color="success" />, label: "Satisfied" },
    5: { icon: <SentimentVerySatisfiedIcon color="success" />, label: "Very Satisfied" },
  };

  function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
  }

  IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
  };

  useEffect(() => {
    setLoading(true);
    const fetchChatHistory = async () => {
      try {
        const chatHistory1 = await ChatService.fetchChatHistory(chatRoomId1);
        const chatHistory2 = await ChatService.fetchChatHistory(chatRoomId2);
        await DocumentService.updateUserChatDetails(username1, username2);
        const rate = currUser.userData;
        setCanRate(rate.isUser);
        const combinedMessages = [...chatHistory1, ...chatHistory2].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        setMessages(combinedMessages);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchChatHistory();
  }, [chatRoomId1, chatRoomId2]);

  useEffect(() => {
    const unsubscribe1 = ChatService.subscribeToChatUpdates(chatRoomId1, (newMsg) => {
      setMessages((prev) => [...prev, newMsg].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
    });
    const unsubscribe2 = ChatService.subscribeToChatUpdates(chatRoomId2, (newMsg) => {
      setMessages((prev) => [...prev, newMsg].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)));
    });
    return () => {
      unsubscribe1?.();
      unsubscribe2?.();
    };
  }, [chatRoomId1, chatRoomId2]);

  useEffect(() => {
    if (messagesEndRef.current) messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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

  const openDialogBox = () => setDialogbox((prev) => !prev);

  const Vcall = async () => {
    const currentPath = window.location.pathname; // e.g., /chat/Patrick_Pratikk4u
    const videoLink = `${currentPath}/videoconf`;
  
    const messageData = {
      chatRoomId: chatRoomId1,
      message: `Click here to join the video call: ${videoLink}`,
      senderId: username1,
      receiverId: username2,
      timestamp: new Date().toISOString(),
    };
  
    try {
      await ChatService.createMessage(messageData);
      navigate('videoconf');
    } catch (error) {
      console.error("Error sending video call message:", error);
    }
  };  

  const submit = async (data) => {
    let mentie = await DocumentService.getIdDetails(username2);
    try {
      await ratingService.rateMentor(mentie.$id, {
        username: username1,
        ment: username2,
        ratingValue,
        review: data.feedback,
      });
      setDialogbox(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  return loading ? (
    <div className="flex-1 flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-r-transparent"></div>
    </div>
  ) : (
    <main className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 px-6 shadow-lg flex justify-between items-center">
        <h1 className="text-lg font-bold">
          <Link to={`/u/${username2}`}>{username2}</Link>
        </h1>
        {canRate ? (
          <button onClick={openDialogBox}>Rate</button>
        ) : (
          <button onClick={Vcall}>
            <VideoCallIcon />
          </button>
        )}
      </header>

      {/* Feedback Dialog */}
      {dialogbox && (
        <div className="absolute h-fit w-[70%] md:w-[40%] bg-green-200 top-[25%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded shadow-xl z-30">
          <div className="bg-green-500 flex justify-between items-center px-4 py-2 text-white text-xl font-bold">
            Feedback !!
            <RxCross1 className="cursor-pointer text-2xl" onClick={openDialogBox} />
          </div>
          <form className="p-4 flex flex-col items-center gap-4" onSubmit={handleSubmit(submit)}>
            <StyledRating
              name="ratings"
              defaultValue={ratingValue}
              IconContainerComponent={IconContainer}
              highlightSelectedOnly
              onChange={(e, newValue) => setRatingValue(newValue)}
            />
            <TextField label="Feedback" multiline rows={4} {...register("feedback")} />
            <Button variant="contained" color="success" type="submit">
              Submit
            </Button>
          </form>
        </div>
      )}

      {/* Video Call Popup */}
      {/* {videoPopup && (
        <div className={`flex-1 overflow-y-scroll p-4 max-h-[70vh] bg-red-200 ${videoPopup ? "" : "hidden"}`}>
          <VideoConference key={videoKey}/>
        </div>
      )} */}

      {/* Chat Messages */}
      <div className={`flex-1 overflow-y-scroll p-4 max-h-[70vh] bg-red-200`}>
        {messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => {
            // Match a video link of the form /chat/any_username_pattern/videoconf
            const videoLinkRegex = /\/chat\/[^\/]+\/videoconf/;
            const match = message.message.match(videoLinkRegex);
            const isVideoLinkMessage = match !== null;
            const videoLink = match?.[0];
            const fullLink = videoLink ? `${window.location.origin}${videoLink}` : null;

            return (
              <div
                key={message.$id || message.id}
                className={`flex ${message.senderId === username1 ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg space-y-2 ${
                    message.senderId === username1 ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                  }`}
                >
                  <div>{message.message}</div>
                  {isVideoLinkMessage && (
                    <button
                      onClick={() => navigate(videoLink)}
                      className="mt-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Join Room
                    </button>
                  )}
                </div>
                <div ref={messagesEndRef}></div>
              </div>
            );
          })}
          </div>
        ) : (
          <div className="text-center text-gray-600 mt-10">No messages yet. Start the conversation!</div>
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
          className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </main>
  );
};

export default ChatPanel;
