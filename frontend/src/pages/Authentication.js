import React, { useEffect, useState } from "react";
import { IoPerson } from "react-icons/io5";
import axios from "axios";
import { IoChatboxEllipses } from "react-icons/io5";
import toast from "react-hot-toast";
import { ImSpinner2 } from "react-icons/im";
import { useAuth } from "../components/context/authContext";

import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [photo, setPhoto] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showApp, setShowApp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const backend_url = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowApp(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const generateUrlImageCloudinary = async (pic) => {
    try {
      setLoading(true);
      if (pic === undefined) {
        toast.error("Please Select an Image");
        return;
      }
      console.log(pic);

      if (pic.type === "image/jpeg" || pic.type === "image/png") {
        const data = new FormData();
        data.append("file", pic);
        data.append("upload_preset", "chat-app");
        data.append("cloud_name", "swanand");

        await fetch("https://api.cloudinary.com/v1_1/swanand/image/upload", {
          method: "post",
          body: data,
        })
          .then((res) => res.json())
          .then((data) => {
            setPhoto(data.url.toString());
            toast.success("Image uploaded successfully");
            setLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
        // console.log(res);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      console.log(name);
      const { data } = await axios.post(
        `${backend_url}/api/chat-app/user/register`,
        {
          name,
          email,
          password,
          pic: photo,
        }
      );

      if (data?.success) {
        toast.success(data?.message);
        setPhoto("");
        setName("");
        setEmail("");
        setPassword("");
        setShowLogin(true);

        console.log(data);
      }
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleLogin = async () => {
    try {
      console.log(name);
      const { data } = await axios.post(
        `${backend_url}/api/chat-app/user/login`,
        {
          email,
          password,
        }
      );

      if (data?.success) {
        localStorage.setItem("auth", JSON.stringify(data));
        setAuth({
          ...auth,
          user: data?.user,
          token: data?.token,
        });

        toast.success(data?.message);
        navigate("/user/chat");
        console.log(data);
      }
    } catch (error) {
      // console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <>
      <div className="w-full bg-gray flex justify-center h-[100vh]  items-center">
        {!showApp && (
          <>
            <div className="animate-bounce flex items-center duration-4000 ease-in-out">
              <IoChatboxEllipses className="text-[4rem] mr-2 text-green" />
              <div className="mb-3 text-[4rem] text-green font-semibold">
                Chat App
              </div>
            </div>
          </>
        )}
        {showApp && (
          <div className="login h-[500px] font-blinker w-[600px] register rounded-3xl flex items-center flex-col transition-all duration-300 ease-in-out relative">
            <div className="px-5 py-4 min-width-[500px] w-[90%]   shadow-2xl shadow-green rounded-2xl flex flex-col justify-center    inside-authentication">
              <div className=" border-2 my-5 w-full  border-green rounded-full  buttons-authentication">
                <button
                  onClick={() => {
                    setShowLogin(true);
                  }}
                  className={`${
                    showLogin
                      ? "text-white bg-green font-semibold duration-300 ease-in  text-xl w-[50%] py-2 rounded-full "
                      : "text-green font-semibold  text-xl w-[50%] py-2 rounded-full "
                  } `}
                  type="button"
                >
                  SignIn
                </button>
                <button
                  onClick={() => {
                    setShowLogin(false);
                  }}
                  className={`${
                    showLogin
                      ? "text-green font-semibold  text-xl w-[50%] py-2 rounded-full "
                      : "text-white bg-green font-semibold  text-xl w-[50%] py-2 rounded-full "
                  } `}
                  type="button"
                >
                  SignUp
                </button>
              </div>
              <form className="mx-3  my-6">
                {showLogin === false && (
                  <>
                    <div className="input my-1 flex justify-center ">
                      <label htmlFor="image" className="cursor-pointer">
                        {photo ? (
                          <img
                            src={photo}
                            alt="image-profile"
                            className="w-[6rem] h-[6rem] border-2 border-green rounded-full"
                          />
                        ) : (
                          <div className="w-[6rem] h-[6rem] border-2 flex justify-center items-center border-green rounded-full">
                            <IoPerson className="w-[4rem] h-[4rem] text-green" />
                          </div>
                        )}
                        <input
                          id="image"
                          className=" input text-xl text-green caret-green rounded-lg px-3 cursor-pointer py-2 w-full my-3 border-2 border-green bg-transparent focus:outline-none"
                          type="file"
                          accept="/image*"
                          hidden
                          onChange={(e) => {
                            generateUrlImageCloudinary(e.target.files[0]);
                          }}
                        ></input>
                      </label>
                    </div>
                    <div className="input my-1  relative">
                      <input
                        id="name"
                        className=" input text-xl text-green caret-green rounded-lg px-3 cursor-pointer py-2 w-full my-3 border-2 border-green bg-transparent focus:outline-none"
                        type="text"
                        autoComplete="off"
                        // value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                        }}
                      ></input>
                      <label
                        htmlFor="name"
                        className=" px-2 duration-300 ease-in-out absolute z-0 left-2  cursor-pointer top-0 bg-gray text-green  text-sm"
                      >
                        Enter your name
                      </label>
                    </div>
                  </>
                )}
                <div className="input my-1 relative">
                  <input
                    id="email"
                    className=" input text-xl px-3 peer text-green cursor-pointer py-2 w-full caret-green rounded-lg my-3 border-2 border-green bg-transparent focus:outline-none"
                    type="text"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  ></input>
                  <label
                    htmlFor="email"
                    className=" px-2 duration-300 ease-in-out absolute cursor-pointer  z-0 left-2 top-0 bg-gray text-green  text-sm"
                  >
                    Enter your email
                  </label>
                </div>
                <div className="input my-1 relative">
                  <input
                    id="password"
                    className=" input text-xl px-3 text-green cursor-pointer py-2 w-full caret-green rounded-lg my-3 border-2 border-green bg-transparent focus:outline-none"
                    type="text"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        showLogin ? handleLogin() : handleRegister();
                      }
                    }}
                  ></input>
                  <label
                    htmlFor="password"
                    className=" px-2 duration-300 ease-in-out absolute z-[0] cursor-pointer  z-0 left-2 top-0 bg-gray text-green  text-sm"
                  >
                    Enter your password
                  </label>
                </div>
                <button
                  className={`${
                    showLogin
                      ? "border-2 my-3 text-white bg-green font-semibold border-green text-xl w-full py-2 rounded-lg"
                      : "hidden"
                  }`}
                  type="button"
                  onClick={handleLogin}
                >
                  SignIn
                </button>
                <button
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleRegister();
                    }
                  }}
                  className={`${
                    showLogin
                      ? "hidden"
                      : "border-2 flex justify-center items-center my-3 text-white bg-green font-semibold border-green text-xl w-full py-2 rounded-lg"
                  }`}
                  type="button"
                  onClick={handleRegister}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin mr-2">
                        <ImSpinner2 />
                      </div>
                      Uploading Image...
                    </>
                  ) : (
                    <div>Register</div>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Authentication;
