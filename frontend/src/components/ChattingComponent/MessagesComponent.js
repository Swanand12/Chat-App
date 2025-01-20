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
          <div key={m._id} className="scrollbar-hidden px-4">
            {selectedChat.isGroupChat ? (
              <>
                {auth.user._id === m.sender._id ? (
                  <>
                    <div className="bg-green w-[fit-content] mb-1 p-2 flex  items-center max-w-[15rem]    ms-[auto] flex flex-wrap items-center rounded-md  my-[2px] ">
                      <span className=" leading-none text-[13px] text-white     ">
                        {m?.content}
                      </span>
                      <span className="leading-none  pl-4 text-[10px] mt-auto text-end ms-[auto] text-lightgray    ">
                        {m?.time}
                      </span>{" "}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white w-[fit-content]  p-2 mb-1 flex flex-col rounded-md   [2px]">
                      <span className="text-[12px] text-start font-semibold text-green">
                        ~ {m?.sender?.name}
                      </span>
                      <div className="max-w-[15rem]  mt-1 me-[auto] flex flex-wrap   ">
                        <span className=" leading-none text-[13px]    ">
                          {m?.content}
                        </span>
                        <span className="leading-none  pl-4 text-[10px] mt-auto text-end  flex items-center ms-[auto]     ">
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
                    <div className="bg-green w-[fit-content] mb-1 p-2 flex items-center max-w-[15rem]    ms-[auto] flex flex-wrap items-center rounded-md  my-[2px] ">
                      <span className=" leading-none text-[13px] text-white    ">
                        {m?.content}
                      </span>
                      <span className="leading-none  pl-4 text-[10px] mt-auto text-end ms-[auto] text-lightgray    ">
                        {m?.time}
                      </span>{" "}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white w-[fit-content] mb-1 p-2 flex items-center max-w-[15rem]    me-[auto] flex flex-wrap items-center rounded-md  my-[2px] ">
                      <span className=" leading-none text-[13px]    ">
                        {m?.content}
                      </span>
                      <span className="leading-none  pl-4 text-[10px] mt-auto text-end  ms-[auto]     ">
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
