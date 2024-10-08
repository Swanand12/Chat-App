import React from "react";
import { useAuth } from "../context/authContext";
import ScrollToBottom from "react-scroll-to-bottom";
import { useSelectedChat } from "../context/selectedChatContext";

const MessagesComponent = ({ messages }) => {
  const [auth, setAuth] = useAuth();
  const [selectedChat, setSelectedChat] = useSelectedChat();

  return (
    <>
      {" "}
      <ScrollToBottom
        initialScrollBehavior="smooth"
        className="flex flex-col h-full   "
      >
        {messages.map((m) => (
          <div key={m._id} className="scrollbar-hidden">
            {selectedChat.isGroupChat ? (
              <>
                {auth.user._id === m.sender._id ? (
                  <>
                    <div className="bg-green w-[fit-content] max-w-[15rem] px-2 py-1  ms-[auto] flex flex-wrap items-center rounded-lg  my-[2px] ">
                      <span className=" leading-tight text-sm text-white     ">
                        {m?.content}
                      </span>
                      <span className="leading-tight  pl-4 text-[10px] ms-[auto] text-lightgray    ">
                        {m?.time}
                      </span>{" "}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white w-[fit-content] rounded-lg px-2  my-1 [2px]">
                      <span className="text-[12px]  text-green">
                        ~ {m?.sender?.name}
                      </span>
                      <div className="max-w-[15rem] mt-1  me-[auto] flex flex-wrap items-center  ">
                        <span className=" leading-tight text-sm   mb-2  ">
                          {m?.content}
                        </span>
                        <span className="leading-tight  pl-4 text-[10px] mb-1 ms-[auto]     ">
                          {m?.time}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                {auth.user._id === m.sender._id ? (
                  <>
                    <div className="bg-green w-[fit-content] max-w-[15rem] px-2 py-1  ms-[auto] flex flex-wrap items-center rounded-lg  my-[2px] ">
                      <span className=" leading-tight text-sm text-white   mb-2  ">
                        {m?.content}
                      </span>
                      <span className="leading-tight  pl-4 text-[10px] ms-[auto] text-lightgray    ">
                        {m?.time}
                      </span>{" "}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white w-[fit-content] max-w-[15rem] px-2 py-1  me-[auto] flex flex-wrap items-center rounded-lg  my-[2px] ">
                      <span className=" leading-tight text-sm   mb-2  ">
                        {m?.content}
                      </span>
                      <span className="leading-tight  pl-4 text-[10px]  ms-[auto]     ">
                        {m?.time}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </ScrollToBottom>
    </>
  );
};

export default MessagesComponent;
