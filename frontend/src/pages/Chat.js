import React, { useState } from "react";
import { useAuth } from "../components/context/authContext";
import SideDrawer from "../components/SideDrawerComponent/SideDrawer";
import MyChats from "../components/ChatsComponent/MyChats";
import ChattingBox from "../components/ChattingComponent/ChattingBox";

const Chat = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();
  return (
    <>
      <div className="w-full bg-green h-[100vh] relative overflow-hidden">
        <SideDrawer fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />

        <div className="flex relative w-full h-[90%] ">
          <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          <ChattingBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
      </div>
    </>
  );
};

export default Chat;
