import express from "express";
import dotenv from "dotenv";
import ConnectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import messageRoute from "./routes/messageRoute.js";
import morgan from "morgan";
import cors from "cors";
import chatRoute from "./routes/chatRoute.js";
import { Server } from "socket.io";

dotenv.config();

ConnectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/chat-app/user", userRoute);
app.use("/api/chat-app/chat", chatRoute);
app.use("/api/chat-app/message", messageRoute);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the Chat-App",
  });
});
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "https://chat-app-1-tutj.onrender.com",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("userData", userData);
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room" + room);
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing");
  });
  socket.on("stop typing", (room) => {
    socket.to(room).emit("stop typing");
  });

  socket.on("new message", (message) => {
    var chat = message.chat;

    chat.users.forEach((user) => {
      if (user._id === message.sender._id) return;

      socket.to(user._id).emit("message recieved", message);
    });
  });

  socket.on("disconnect", () => {
    console.log("disconnected from the socket");
  });
});
