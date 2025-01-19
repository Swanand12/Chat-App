import React, { useEffect, useState } from "react";
import { useSelectedChat } from "../context/selectedChatContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/authContext";
import MessagesComponent from "./MessagesComponent";
import io from "socket.io-client";
import { useNotification } from "../context/notificationContext";
import { IoMdSend } from "react-icons/io";

const ENDPOINT = "https://chat-app-um5l.onrender.com";
// const ENDPOINT = "http://localhost:8080";

var socket, selectedChatCompare;

const ChattingContainer = ({ fetchAgain, setFetchAgain, setIsTyping }) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedChat, setSelectedChat] = useSelectedChat();
  const [notification, setNotification] = useNotification();
  const [auth, setAuth] = useAuth();
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  const backend_url = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    socket = io(ENDPOINT);

    socket.on("connect", () => {
      console.log("Connected to socket");
    });

    socket.emit("setup", auth.user);

    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  console.log(notification);
  const fetchMessage = async () => {
    if (!selectedChat) return;
    try {
      const chatId = selectedChat._id;
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };
      socket.emit("join chat", selectedChat._id);
      const { data } = await axios.post(
        `${backend_url}/api/chat-app/message/fetch-messages`,
        { chatId },

        config
      );

      setMessages(data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessage();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (message) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== message.chat._id
      ) {
        if (!notification.includes(message)) {
          setNotification([...notification, message]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, message]);
      }
    });
  });

  const sendMessage = async (content, selectedChat) => {
    socket.emit("stop typing", selectedChat._id);
    setTyping(false);
    try {
      if (!content || !selectedChat) {
        toast.error("Enter Something to send the message");
        return;
      }
      const chatId = selectedChat._id;

      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.post(
        `${backend_url}/api/chat-app/message/send-message`,
        { content, chatId },
        config
      );

      if (data.success) {
        socket.emit("new message", data.message);
        setMessages((prevMessages) => [...prevMessages, data.message]);

        setNewMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timer = 20000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timer) {
        setTyping(false);
        socket.emit("stop typing", selectedChat._id);
      }
    }, timer);
  };
  return (
    <>
      <div className="h-[100%] bg-lightgray">
        <div className="h-[calc(100%-60px)] md:h-[calc(100%-80px)] py-1  px-3 ">
          <MessagesComponent messages={messages} />
        </div>
        <div className="input m-[auto]  relative  rounded-lg w-[90%]  h-[60px]  md:h-[80px] flex justify-center items-center">
          <input
            id="search"
            onChange={(e) => typingHandler(e)}
            className=" input font-poppins text-sm px-3 relative cursor-pointer w-full border-2 border-green h-[45px] rounded-lg   bg-transparent focus:outline-none"
            type="text"
            value={newMessage}
            placeholder="Type your message here...."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage(newMessage, selectedChat);
              }
            }}
            autoComplete="off"
          ></input>
          <button
            type="button"
            onClick={() => sendMessage(newMessage, selectedChat)}
            className=" bg-green text-black pl-3  p-2.5  rounded-lg absolute right-0"
          >
            <IoMdSend size={25} />
          </button>
        </div>
      </div>
    </>
  );
};

export default ChattingContainer;
