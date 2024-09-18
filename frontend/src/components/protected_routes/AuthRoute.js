import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { Outlet } from "react-router-dom";

const AuthRoute = () => {
  const [ok, setOk] = useState(false);
  // eslint-disable-next-line
  const [auth, setAuth] = useAuth();
  const backend_url = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(
          `${backend_url}/api/chat-app/user/user-auth`,
          {
            headers: {
              Authorization: auth?.token,
            },
          }
        );

        if (data) {
          setOk(data.ok);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (auth?.token) checkAuth();
    // eslint-disable-next-line
  }, [auth?.token]);

  return ok ? <Outlet /> : "Loading...";
};

export default AuthRoute;
