import express from "express";
import { requireSignIn } from "./../middlewares/userMiddleware.js";
import {
  fetchMessagesController,
  sendMessageController,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/send-message", requireSignIn, sendMessageController);

router.post("/fetch-messages", fetchMessagesController);

export default router;
