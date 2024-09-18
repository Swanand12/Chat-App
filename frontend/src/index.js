import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/context/authContext";
import { SelectedChatProvider } from "./components/context/selectedChatContext";
import { MyChatProvider } from "./components/context/myChatContext";
import { NotificationProvider } from "./components/context/notificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <SelectedChatProvider>
      <MyChatProvider>
        <NotificationProvider>
          <BrowserRouter>
            <React.StrictMode>
              <App />
            </React.StrictMode>
          </BrowserRouter>
        </NotificationProvider>
      </MyChatProvider>
    </SelectedChatProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
