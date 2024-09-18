import React, { useEffect, useState } from "react";
import { useChats } from "./context/myChatContext";
import { useAuth } from "./context/authContext";
import toast from "react-hot-toast";
import axios from "axios";
import { useSelectedChat } from "./context/selectedChatContext";
import { IoMdAdd } from "react-icons/io";
import { Badge, Modal, notification } from "antd";
import UserListItem from "./SideDrawerComponent/UserListItem";
import UserBadge from "../pages/UserComponent/UserBadge";
import {
  capitalizeWords,
  getIndividualNotificationNum,
  getLatestMessageOrEmail,
  getSenderEmail,
  getSenderName,
  getSenderPic,
} from "./ImportantFunctions/Function";
import Spinner from "../pages/UserComponent/Spinner";
import { useNotification } from "./context/notificationContext";

const MyChats = ({ fetchAgain, setFetchAgain }) => {
  const [chat, setChat] = useChats();
  const [auth, setAuth] = useAuth();
  const [selectedChat, setSelectedChat] = useSelectedChat();
  const [createGroup, setCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [users, setUsers] = useState([]);
  const [userToAdd, setUserToAdd] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [createLoading, setCreateloading] = useState(false);
  const [notification, setNotification] = useNotification();

  const backend_url = process.env.REACT_APP_BACKEND_URL;
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.get(
        `${backend_url}/api/chat-app/chat/fetch-chat`,
        config
      );

      if (data?.success) {
        setChat(data?.fetchChat);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchChats();
  }, [fetchAgain, selectedChat]);

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

  const handleSelectedChat = (mychat) => {
    if (mychat === selectedChat) return;
    setSelectedChat(mychat);
    setFetchAgain(!fetchAgain);
  };

  const handleAddUser = (user) => {
    if (userToAdd.find((u) => u._id === user._id)) {
      toast.success("User already added");
      return;
    }
    setUserToAdd([user, ...userToAdd]);
  };

  const handleRemove = (user) => {
    setUserToAdd(userToAdd.filter((c) => c._id !== user._id));
  };

  const createGroupChat = async (groupName, userToAdd) => {
    try {
      if (!groupName || !userToAdd) {
        toast.error("Please enter all the fields");
        return;
      }
      setCreateloading(true);

      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.post(
        `${backend_url}/api/chat-app/chat/create-group`,
        { name: groupName, users: userToAdd },
        config
      );

      if (data?.success) {
        toast.success(data?.message);
        setGroupName(null);
        setChat(data.groupChat);
        setFetchAgain(!fetchAgain);
        setCreateGroup(false);
        setCreateloading(false);

        setUserToAdd([]);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      setCreateloading(false);
    }
  };

  useEffect(() => {
    if (!selectedChat || !notification) return;

    setNotification(
      notification.filter((n) => n.chat._id !== selectedChat._id)
    );
  }, [selectedChat]);
  console.log();
  return (
    <>
      <div className="w-[100%] md:w-[35%] chat  shadow-2xl box-border rounded-lg m-2 md:max-h-[87vh] bg-gray  ">
        <div className=" my-3 mx-5 flex items-center justify-between">
          <h1 className="text-green font-bold   text-3xl md:block hidden ">
            Chats
          </h1>
          <button
            onClick={() => setCreateGroup(true)}
            type="button "
            className="py-2 flex   text-gray duration-300 items-center font-semibold rounded-lg px-3 bg-green "
          >
            Group Chat <IoMdAdd className="ml-3 flex items-center" />{" "}
          </button>
        </div>

        <div className="overflow-y-scroll  pl-5 h-[88%] scrollbar-hidden ">
          {chat.length > 0 &&
            chat.map((mychat) => (
              <div
                key={mychat._id}
                onClick={() => handleSelectedChat(mychat)}
                className={`${
                  selectedChat._id === mychat._id
                    ? "shadow-xl scale-105 rounded-xl w-[95%] "
                    : ""
                } h-[4rem] hover:shadow-xl hover:scale-105 hover:w-[95%] hover:rounded-xl cursor-pointer items-center  duration-300   bg-gray font-poppins  py-1 px-2   flex }`}
              >
                <div>
                  {" "}
                  <img
                    className="ll hover:shadow-lg w-[2.5rem] rounded-full h-[2.5rem]  mx-2 my-1.5"
                    src={getSenderPic(mychat, auth)}
                    alt="user-image"
                  />
                </div>
                <div className="ml-4 flex flex-col justify-center">
                  <span className="font-semibold">
                    {capitalizeWords(getSenderName(mychat, auth))}
                  </span>
                  <span className="text-[0.8rem] flex">
                    {getLatestMessageOrEmail(mychat, auth)}
                  </span>
                </div>
                <div className="ms-[auto]">
                  <Badge
                    count={getIndividualNotificationNum(mychat, notification)}
                    color="green"
                    className={
                      notification.find((n) => n.chat._id === mychat._id)
                        ? ""
                        : "hidden"
                    }
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
      <Modal
        open={createGroup}
        onCancel={() => setCreateGroup(false)}
        footer={false}
      >
        <div>
          <div className="input my-1 relative flex items-center">
            <input
              id="search"
              onChange={(e) => setGroupName(e.target.value)}
              className=" input font-poppins rounded-lg text-xl px-3 peer text-green cursor-pointer py-2 w-full caret-green mt-3 mb-1 border-2 border-green bg-transparent focus:outline-none"
              type="text"
              autoComplete="off"
            ></input>
            <label
              htmlFor="search"
              className=" px-2 duration-300 ease-in-out absolute cursor-pointer  z-0 left-2 top-0 bg-[#ffffff] text-green  text-sm"
            >
              Enter group name
            </label>
          </div>
          <div className={``}>
            <div
              className={`w-full flex flex-wrap bg-gray ${
                userToAdd.length > 0 ? "py-1" : ""
              }`}
            >
              {userToAdd?.map((user) => (
                <UserBadge
                  userToAdd={user}
                  handleFunction={() => handleRemove(user)}
                  className={`${user ? "" : "hidden"}`}
                />
              ))}
            </div>
            <div className="input my-1 relative flex items-center">
              <input
                id="search"
                onChange={(e) => handleSearch(e.target.value)}
                className=" input font-poppins rounded-lg text-xl px-3 peer text-green cursor-pointer py-2 w-full caret-green mt-3 mb-1 border-2 border-green bg-transparent focus:outline-none"
                type="text"
                autoComplete="off"
              ></input>
              <label
                htmlFor="search"
                className=" px-2 duration-300 ease-in-out absolute cursor-pointer  z-0 left-2 top-0 bg-[#ffffff] text-green  text-sm"
              >
                Add friends
              </label>
            </div>
            <div className="h-full pt-2 overflow-y-scroll scrollbar-hidden">
              {loadingUsers ? (
                <>
                  <span className="flex items-center justify-center w-full">
                    <Spinner />
                    Loading...
                  </span>
                </>
              ) : (
                <>
                  <div className="pb-1 h-full   ">
                    {users.slice(0, 4).map((user) => (
                      <UserListItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="w-full flex justify-end my-1">
          {createLoading ? (
            <>
              <button
                className=" py-2  
            text-xl w-[10rem] bg-opacity-90 rounded-lg flex items-center justify-center  hover:scale-105 duration-300 bg-green text-white"
                type="button"
                onClick={() => createGroupChat(groupName, userToAdd)}
              >
                <Spinner />
                Create
              </button>
            </>
          ) : (
            <button
              className=" py-2  
              text-xl w-[10rem] rounded-lg hover:scale-105 duration-300 bg-green text-white"
              type="button"
              onClick={() => createGroupChat(groupName, userToAdd)}
            >
              Create
            </button>
          )}
        </div>
      </Modal>
    </>
  );
};

export default MyChats;
