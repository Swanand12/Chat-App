import React, { createContext, useContext, useState } from "react";

const SelectedChatContext = createContext();

const SelectedChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState("");

  return (
    <SelectedChatContext.Provider value={[selectedChat, setSelectedChat]}>
      {children}
    </SelectedChatContext.Provider>
  );
};

const useSelectedChat = () => useContext(SelectedChatContext);

export { useSelectedChat, SelectedChatProvider };
