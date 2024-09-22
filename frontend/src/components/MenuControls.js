import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { Checkbox, Modal } from "antd";
import Spinner from "../pages/UserComponent/Spinner";

import { useAuth } from "./context/authContext";
import axios from "axios";
import toast from "react-hot-toast";
import {
  capitalizeWords,
  getSenderEmail,
  getSenderName,
  getSenderPic,
} from "./ImportantFunctions/Function";
import { useChats } from "./context/myChatContext";

const MenuControls = ({ setCreateGroup, fetchAgain, setFetchAgain }) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [auth, setAuth] = useAuth();
  const [openDeleteChatsModal, setOpenDeleteChatsModal] = useState(false);
  const [chat, setChat] = useChats();
  const [isChecked, setIsChecked] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const [selectChatsToremove, setSelectChatsToRemove] = useState([]);
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
  }, [fetchAgain]);

  const handleRemoveProcess = (value, id) => {
    let all = [...selectChatsToremove];

    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setSelectChatsToRemove(all);
  };

  const handleRemoveChats = async () => {
    try {
      if (selectChatsToremove.length == 0) {
        toast.error("Select the chats to remove");
        return;
      }

      const config = {
        headers: {
          Authorization: auth?.token,
        },
      };

      const { data } = await axios.put(
        `${backend_url}/api/chat-app/chat/remove-chats`,
        { chats: selectChatsToremove },
        config
      );

      if (data?.success) {
        setFetchAgain(!fetchAgain);
        toast.success(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="relative flex flex-col ">
        <div className="flex items-center mr-2">
          <button type="button" onClick={() => setOpenMenu(!openMenu)}>
            <GiHamburgerMenu className="text-2xl  " />
          </button>
        </div>
        <div
          className={`${
            openMenu ? "translate-x-0 z-10 " : "translate-x-6 z-[-1] "
          } absolute  top-10 w-[12rem] flex-col  p-2 duration-300 transform bg-white flex right-0 justify-center`}
        >
          <button
            onClick={() => setCreateGroup(true)}
            type="button "
            className="h-[3rem] justify-center flex mb-2 hover:bg-gray  duration-300 items-center font-semibold  "
          >
            Group Chat <IoMdAdd className="ml-3 flex items-center" />{" "}
          </button>
          <button
            onClick={() => setOpenDeleteChatsModal(true)}
            type="button "
            className=" flex h-[3rem] justify-center hover:bg-gray   duration-300 items-center font-semibold  "
          >
            Delete Chats <IoMdAdd className="ml-3 flex items-center" />{" "}
          </button>
          <Modal
            open={openDeleteChatsModal}
            footer={false}
            onCancel={() => setOpenDeleteChatsModal(false)}
          >
            <div className=" ">
              <h1 className=" bg-green text-white text-2xl font-semibold justify-center mb-1 p-2 my-1 relative flex items-center">
                Delete Chats
              </h1>
              <div className="h-full pt-2 overflow-y-scroll ">
                {loadingUsers ? (
                  <>
                    <span className="flex items-center justify-center w-full">
                      <Spinner />
                      Loading...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="pb-1 h-[20rem]  w-[100%]   ">
                      {chat.length > 0 &&
                        chat.map((mychat) => (
                          <>
                            <div className="overflow-y-scroll bg-white flex  pl-5 hover:bg-gray w-[100%] scrollbar-hidden ">
                              <input
                                id="checkDelete"
                                type="checkbox"
                                className="m-2 cursor-pointer "
                                key={mychat._id}
                                onChange={(e) => {
                                  handleRemoveProcess(
                                    e.target.checked,
                                    mychat._id
                                  );
                                }}
                              />

                              <div
                                className={`h-[4rem] w-[90%]    cursor-pointer items-center  duration-300  font-poppins  py-1 px-2   flex `}
                              >
                                <div>
                                  <img
                                    className="ll hover:shadow-lg w-[2.5rem] rounded-full h-[2.5rem]  mx-2 my-1.5"
                                    src={getSenderPic(mychat, auth)}
                                    alt="user-image"
                                  />
                                </div>
                                <div className="ml-4 flex flex-col justify-center">
                                  <span className="font-semibold">
                                    {capitalizeWords(
                                      getSenderName(mychat, auth)
                                    )}
                                  </span>
                                  <span className="text-[0.8rem] flex">
                                    {getSenderEmail(mychat, auth)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        ))}
                    </div>
                  </>
                )}
              </div>
              <div className={`flex justify-center py-1`}>
                {" "}
                <button
                  onClick={handleRemoveChats}
                  className="bg-green rounded-lg ml-2 font-semibold hover:opacity-90  text-[#ffffff] h-[2.5rem] w-[10rem] text-lg "
                  type="button"
                >
                  Remove
                </button>
              </div>
            </div>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default MenuControls;
