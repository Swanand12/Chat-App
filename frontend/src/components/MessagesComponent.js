import React from "react";
import { useAuth } from "./context/authContext";
import ScrollableFeed from "react-scrollable-feed";
import { useSelectedChat } from "./context/selectedChatContext";

const MessagesComponent = ({ messages }) => {
  const [auth, setAuth] = useAuth();
  const [selectedChat, setSelectedChat] = useSelectedChat();

  return (
    <>
      {" "}
      <ScrollableFeed className="flex flex-col  scrollbar-hidden">
        {messages.map((m) => (
          <div key={m._id}>
            {selectedChat.isGroupChat ? (
              <>
                {auth.user._id === m.sender._id ? (
                  <>
                    <div className="bg-green w-[fit-content] max-w-[15rem] px-3 py-2 ms-[auto] flex flex-wrap items-center rounded-lg  my-[2px] ">
                      <span className=" leading-none text-sm text-white font-semibold    ">
                        {m?.content}
                      </span>
                      <span className="leading-none  pl-4 text-[10px] ms-[auto] text-lightgray font-semibold   ">
                        {m?.time}
                      </span>{" "}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white w-[fit-content] rounded-lg px-3  my-[2px]">
                      <span className="text-[12px]  text-green">
                        ~ {m?.sender?.name}
                      </span>
                      <div className="max-w-[15rem] mt-1  me-[auto] flex flex-wrap items-center  ">
                        <span className=" leading-none text-sm font-semibold  mb-2  ">
                          {m?.content}
                        </span>
                        <span className="leading-none  pl-4 text-[10px] mb-1 ms-[auto]  font-semibold   ">
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
                    <div className="bg-green w-[fit-content] max-w-[15rem] px-3 py-2 ms-[auto] flex flex-wrap items-center rounded-lg  my-[2px] ">
                      <span className=" leading-none text-sm text-white font-semibold  mb-2  ">
                        {m?.content}
                      </span>
                      <span className="leading-none  pl-4 text-[10px] ms-[auto] text-lightgray font-semibold   ">
                        {m?.time}
                      </span>{" "}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-white w-[fit-content] max-w-[15rem] px-3 py-2 me-[auto] flex flex-wrap items-center rounded-lg  my-[2px] ">
                      <span className=" leading-none text-sm font-semibold  mb-2  ">
                        {m?.content}
                      </span>
                      <span className="leading-none  pl-4 text-[10px]  ms-[auto]  font-semibold   ">
                        {m?.time}
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        ))}
      </ScrollableFeed>
    </>
  );
};

export default MessagesComponent;
