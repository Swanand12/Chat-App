import React, { useState } from "react";
import { useSelectedChat } from "../context/selectedChatContext";
import { useAuth } from "../context/authContext";
import ProfileModal from "../SideDrawerComponent/ProfileModal";
import {
  capitalizeWords,
  getSender,
  getSenderName,
  getSenderPic,
} from "../ImportantFunctions/Function";
import { FaEye } from "react-icons/fa";
import { IoMdArrowRoundBack } from "react-icons/io";
import GroupControlsModalComponents from "./GroupControlsModalComponents";
import ChattingContainer from "./ChattingContainer";
import { Typewriter } from "react-simple-typewriter";

const ChattingBox = ({ fetchAgain, setFetchAgain }) => {
  const [selectedChat, setSelectedChat] = useSelectedChat();
  const [showProfile, setShowProfile] = useState(false);
  const [auth, setAuth] = useAuth();
  const [isTyping, setIsTyping] = useState(false);
  const [showGroupControls, setShowGroupControls] = useState(false);

  const sender = getSender(selectedChat, auth);
  const senderName = getSenderName(selectedChat, auth);
  const pic = getSenderPic(selectedChat, auth);

  return (
    <>
      <div
        className={`md:w-[65%]  ${
          selectedChat && selectedChat ? "slide-in" : "slide-out"
        }   bg-gray  w-full  h-[100svh] md:h-full   absolute md:static `}
      >
        <div
          className={`${
            selectedChat && selectedChat ? "md:flex flex-col" : "md:hidden"
          } h-[100%] relative`}
        >
          <div className=" absolute w-full h-[65px] bg-gray flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <img
                  className="image hover:shadow-lg w-[2.5rem] rounded-full h-[2.5rem] border border-green mx-2 my-1.5"
                  src={pic}
                  alt="user-image"
                />
              </div>
              <div className="flex flex-col font-poppins  ml-2">
                <h1 className="text-2xl font-semibold  flex flex-col ">
                  {capitalizeWords(senderName)}
                </h1>
                <span className="text-green">{isTyping && <>typing...</>}</span>
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setSelectedChat("")}
                className=" md:hidden visible bg-green mx-2 text-gray duration-300 rounded-lg px-3 py-2"
              >
                <IoMdArrowRoundBack className="text-xl" />
              </button>
              {selectedChat?.isGroupChat && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowGroupControls(true)}
                    className="  bg-green mx-2 text-gray rounded-lg duration-300  px-3 py-2"
                  >
                    <FaEye className="text-xl" />
                  </button>
                  <GroupControlsModalComponents
                    showGroupControls={showGroupControls}
                    setShowGroupControls={setShowGroupControls}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              )}
            </div>
          </div>
          <div className="bg-lightgray  h-[100%] pt-[70px] border-gray border-b-[30px]  ">
            <ChattingContainer
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
              setIsTyping={setIsTyping}
            />
          </div>
        </div>

        {!selectedChat && (
          <div
            className={`w-full  text-4xl  text-green h-full flex items-center justify-center font-semibold`}
          >
            {" "}
            <Typewriter
              words={[
                "Chat with your friends!",
                "Start a new conversation.",
                "Connect with your buddy now!",
              ]}
              loop={0}
              cursor
              cursorStyle="|"
              typeSpeed={50}
              deleteSpeed={30}
              delaySpeed={1500}
            />
            {/* <h1>Select the chat to Chat with your friend</h1> */}
          </div>
        )}
      </div>

      <ProfileModal
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        user={sender}
      />
    </>
  );
};

export default ChattingBox;
