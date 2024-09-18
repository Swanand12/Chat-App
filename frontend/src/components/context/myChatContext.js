import React, { createContext, useContext, useState } from "react";

const MyChatContext = createContext();

const MyChatProvider = ({ children }) => {
  const [chat, setChat] = useState([]);

  return (
    <MyChatContext.Provider value={[chat, setChat]}>
      {children}
    </MyChatContext.Provider>
  );
};

const useChats = () => useContext(MyChatContext);

export { useChats, MyChatProvider };
