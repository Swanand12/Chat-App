import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { useAuth } from "./context/authContext";
import UserListItem from "./SideDrawerComponent/UserListItem";
import { useSelectedChat } from "./context/selectedChatContext";
import { useChats } from "./context/myChatContext";
import { GoBellFill } from "react-icons/go";
import { BiSolidChevronDown } from "react-icons/bi";
import { IoChatboxEllipses } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { AiOutlineLogout } from "react-icons/ai";
import ProfileModal from "./ProfileModal";
import { Badge } from "antd";
import { getNotificationNum } from "./ImportantFunctions/Function";
// import useNotification from "antd/es/notification/useNotification";
import { useNotification } from "./context/notificationContext";
import { useNavigate } from "react-router-dom";

const SideDrawer = ({ fetchAgain, setFetchAgain }) => {
  const [auth, setAuth] = useAuth();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useChats();
  const [notification, setNotification] = useNotification();
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedChat, setSelectedChat] = useSelectedChat();
  const navigate = useNavigate();
  const backend_url = process.env.REACT_APP_BACKEND_URL;

  const handleSearch = async () => {
    try {
      if (!searchQuery) {
        toast.error("Please enter something in search");
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

      if (data?.users.length > 0) {
        setLoadingUsers(false);
        toast.success(data?.message);
        setUsers(data?.users);
      } else {
        toast.error("searched user does not exist");
        setLoadingUsers(false);
      }
    } catch (error) {
      console.log(error);
      setLoadingUsers(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.post(
        `${backend_url}/api/chat-app/chat/access-create-chat`,
        { userId },
        config
      );

      if (data?.success) {
        setChat(data);
        setFetchAgain(!fetchAgain);
        setShowDrawer(false);
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogOut = () => {
    try {
      localStorage.removeItem("auth");
      setAuth({
        user: null,
        token: "",
      });
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Header */}
      <div
        className={`h-[10vh] bg-gray mx-2 rounded-lg mt-2 flex relative ${
          selectedChat ? "md:flex hidden " : ""
        }  justify-between shadow-lg items-center`}
      >
        <button
          type="button"
          onClick={() => setShowDrawer(!showDrawer)}
          className="px-3 py-2 mx-4 md:w-[8rem] justify-center bg-gray rounded-lg font-semibold hover:bg-green hover:text-[#D6EFD8] duration-300 flex items-center"
        >
          <FaSearch className="text-xl md:text-normal md:mr-5" />
          <span className="hidden md:block">Search</span>
        </button>
        <div className="flex items-center ">
          <IoChatboxEllipses className="  text-[3rem] text-green mr-3" />
          <h1 className="mb-3 sm:flex hidden  sm:text-4xl font-bold text-green">
            Chat App
          </h1>
        </div>
        <div className="flex items-center mx-3 ">
          <div className="mr-4">
            <Badge
              count={getNotificationNum(notification)}
              color={"green"}
              className={notification.length ? "top-[0.4rem] left-2" : "hidden"}
            />
            <GoBellFill className="text-2xl " />
          </div>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center px-1 bg-gray rounded-lg"
          >
            <img
              className="rounded-full hover:shadow-lg w-[2.5rem] h-[2.5rem] mx-2 my-1.5"
              src={auth.user.pic}
              alt="user-image"
            />
            <BiSolidChevronDown className="text-xl mx-2" />
          </button>
          <div
            className={`${
              showDropdown ? "translate-x-0" : "translate-x-[150%]"
            } absolute z-10 right-5 shadow-lg bg-lightgray  dropdown duration-300 transform font-semibold w-[10rem]   rounded-lg p-2 flex flex-col top-[100%] `}
          >
            <span
              onClick={() => setShowProfile(!showProfile)}
              className="p-2 cursor-pointer rounded-lg flex items-center  hover:shadow-lg text-lg hover:text-green"
            >
              <CgProfile className="text-[2.5rem] pr-2" />
              Profile
            </span>
            <span
              onClick={handleLogOut}
              className="p-2 cursor-pointer flex items-center  rounded-lg hover:shadow-lg text-lg hover:text-green"
            >
              <AiOutlineLogout className="text-[2.5rem] pr-2" />
              Logut
            </span>
          </div>
        </div>

        {/* SideDrawer */}
        <div
          className={`w-[20rem] absolute z-10 top-[120%] p-2 transform shadow-2xl ${
            showDrawer ? "translate-x-0" : "-translate-x-[110%]"
          } duration-300  h-[80vh] left-3  px-3 overflow-hidden  rounded-lg bg-green`}
        >
          <div className="input h-[15%] relative flex items-center">
            <input
              id="search"
              onChange={(e) => setSearchQuery(e.target.value)}
              className=" input font-poppins text-xl px-3 peer text-gray cursor-pointer py-2 w-full caret-gray rounded-lg mt-3 mb-1 border-2 border-gray bg-transparent focus:outline-none"
              type="text"
              autoComplete="off"
            ></input>
            <label
              htmlFor="search"
              className=" px-2 duration-300 ease-in-out absolute cursor-pointer  z-0 left-2 top-4 bg-green text-gray  text-sm"
            >
              Find your friend
            </label>
            <button
              onClick={handleSearch}
              type="button"
              className="absolute mt-2 bg-gray py-2 px-3 rounded-r-lg text-green  text-xl right-0"
            >
              Go
            </button>
          </div>
          <div className="h-[85%] mb-2 overflow-y-scroll scrollbar-hidden">
            {loadingUsers ? (
              <>
                <span>Loading...</span>
              </>
            ) : (
              <>
                <div className="mb-1 h-full   ">
                  {users.map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => accessChat(user._id)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ProfileModal
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        user={auth?.user}
      />
    </>
  );
};

export default SideDrawer;
