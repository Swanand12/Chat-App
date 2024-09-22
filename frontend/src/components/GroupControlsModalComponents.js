import React, { useState } from "react";
import { Modal } from "antd";
import UserBadge from "../pages/UserComponent/UserBadge";
import UserListItem from "./SideDrawerComponent/UserListItem";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelectedChat } from "./context/selectedChatContext";
import { useAuth } from "./context/authContext";
import Spinner from "../pages/UserComponent/Spinner";

const GroupControlsModalComponents = ({
  showGroupControls,
  setShowGroupControls,
  fetchAgain,
  setFetchAgain,
}) => {
  const [users, setUsers] = useState([]);
  const [auth, setAuth] = useAuth();
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedChat, setSelectedChat] = useSelectedChat();
  const [groupRename, setGroupRename] = useState("");
  const backend_url = process.env.REACT_APP_BACKEND_URL;

  const handleAddUser = async (userId, chatId) => {
    try {
      if (selectedChat.groupAdmin._id !== auth.user._id) {
        toast.error("You are not an Admin to Add user in the group");
        return;
      }
      if (auth.user._id === userId) {
        toast.error("You are already in the group");
        return;
      }

      if (selectedChat?.users.find((u) => u._id === userId)) {
        toast.error("User already exist in group");
        return;
      }

      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.put(
        `${backend_url}/api/chat-app/chat/add-participant-in-group`,
        { userId, chatId },
        config
      );

      if (data?.success) {
        toast.success(data.message);

        setSelectedChat(data.addedParticipant);
        setFetchAgain(!fetchAgain);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = async (searchQuery) => {
    try {
      if (!searchQuery.trim()) {
        setUsers([]);
        return;
      }
      setLoadingUsers(true);

      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.get(
        `${backend_url}/api/chat-app/user/users?search=${searchQuery}`,
        config
      );

      if (data?.success) {
        setLoadingUsers(false);
        setUsers(data?.users);
      } else {
        toast.error(data?.message);
        setLoadingUsers(false);
      }
    } catch (error) {
      console.log(error);
      setLoadingUsers(false);
    }
  };

  const handleRemove = async (userId, chatId) => {
    try {
      if (auth?.user?._id === userId) {
        toast.error("If you want to leave group then press leave button");
        return;
      }
      if (auth.user._id !== selectedChat.groupAdmin._id) {
        toast.error("You cannot remove anyone You are not an Admin");
        return;
      }

      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.put(
        `${backend_url}/api/chat-app/chat/remove-participant-from-group`,
        { userId, chatId },
        config
      );

      if (data?.success) {
        toast.success(data.message);

        setSelectedChat(data.removeParticipant);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleLoggedUserRemove = async (userId, chatId) => {
    try {
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.put(
        `${backend_url}/api/chat-app/chat/remove-participant-from-group`,
        { userId, chatId },
        config
      );

      if (data?.success) {
        toast.success("You left the group");
        setShowGroupControls(false);
        setSelectedChat("");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renameGroup = async (groupRename, id) => {
    try {
      if (!groupRename) {
        toast.error("Please enter something to rename group");
        return;
      }

      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.put(
        `${backend_url}/api/chat-app/chat/rename-group`,
        { chatName: groupRename, chatId: id },
        config
      );

      if (data?.success) {
        toast.success(data.message);
        setSelectedChat({ ...selectedChat, chatName: [data.chatName] });
        setFetchAgain(!fetchAgain);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Modal
        open={showGroupControls}
        onCancel={() => setShowGroupControls(false)}
        footer={false}
      >
        <div className="input ms-[auto] flex flex-col my-3 relative md:flex  md:flex-row items-end  ">
          <input
            id="search"
            onChange={(e) => setGroupRename(e.target.value)}
            className=" input font-poppins text-xl px-3 peer text-green cursor-pointer py-2 w-full caret-green rounded-lg mt-3  border-2 border-green bg-transparent focus:outline-none"
            type="text"
            autoComplete="off"
          ></input>
          <label
            htmlFor="search"
            className=" px-2 duration-300 ease-in-out absolute cursor-pointer  z-0 left-2 top-0 bg-[#ffffff] text-green  text-sm"
          >
            Rename group
          </label>
          <button
            className="bg-blue-600 rounded-lg ml-2 mt-3 md:mt-0 hover:opacity-90  text-[#ffffff] h-[3rem] w-[10rem] px-3 text-lg "
            type="button"
            onClick={() => renameGroup(groupRename, selectedChat?._id)}
          >
            Update
          </button>
        </div>

        <div className={``}>
          <div
            className={`w-full my-3 flex flex-wrap bg-gray rounded-lg ${
              selectedChat?.users.length > 0 ? "py-1" : ""
            }`}
          >
            {selectedChat?.users?.map((user) => (
              <UserBadge
                userToAdd={user}
                key={user._id}
                handleFunction={() => {
                  handleRemove(user?._id, selectedChat?._id);
                }}
              />
            ))}
          </div>
          <div className="input my-1 relative flex items-center">
            <input
              id="search"
              onChange={(e) => handleSearch(e.target.value)}
              className=" input font-poppins text-xl px-3 peer text-green cursor-pointer py-2 w-full caret-green rounded-lg mt-3 mb-1 border-2 border-green bg-transparent focus:outline-none"
              type="text"
              autoComplete="off"
            ></input>
            <label
              htmlFor="search"
              className=" px-2 duration-300 ease-in-out absolute cursor-pointer  z-0 left-2 top-0 bg-[#ffffff] text-green  text-sm"
            >
              Add users to group
            </label>
          </div>
          <div className="h-full pt-2 overflow-y-scroll scrollbar-hidden">
            {loadingUsers ? (
              <>
                <span className="flex items-center">
                  <Spinner />
                  Loading...
                </span>
              </>
            ) : (
              <>
                <div className="pb-1 h-full items-center  flex flex-col ">
                  {users.slice(0, 4).map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() =>
                        handleAddUser(user._id, selectedChat._id)
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className="my-3 w-full flex justify-end ">
          <button
            className="bg-red-600 rounded-lg ml-2  hover:opacity-90  text-[#ffffff] h-[3rem] w-[10rem] text-lg "
            type="button"
            onClick={() =>
              handleLoggedUserRemove(auth.user._id, selectedChat?._id)
            }
          >
            Leave
          </button>
        </div>
      </Modal>
    </>
  );
};

export default GroupControlsModalComponents;
