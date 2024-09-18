import express from "express";
import {
  addParticipantToGroupController,
  chatAccessAndCreateController,
  chatFetchController,
  createGroupChat,
  removeParticipantFromGroupController,
  renameGroupController,
} from "../controllers/chatController.js";
import { requireSignIn } from "../middlewares/userMiddleware.js";

const router = express.Router();

// ACCESS OR CREATE CHAT || METHOD : POST
router.post(
  "/access-create-chat",
  requireSignIn,
  chatAccessAndCreateController
);

// FETCH ALL CHATS OF LOGIN USER || METHOD : GET
router.get("/fetch-chat", requireSignIn, chatFetchController);

// CREATE GROUP CHAT || METHOD : POST
router.post("/create-group", requireSignIn, createGroupChat);

// RENAME GROUP CHAT || METHOD : POST
router.put("/rename-group", requireSignIn, renameGroupController);

// ADD PARTICIPANT TO GROUP CHAT || METHOD : POST
router.put(
  "/add-participant-in-group",
  requireSignIn,
  addParticipantToGroupController
);

// REMOVE PARTICIPANT FROM GROUP CHAT || METHOD : POST
router.put(
  "/remove-participant-from-group",
  requireSignIn,
  removeParticipantFromGroupController
);
export default router;
