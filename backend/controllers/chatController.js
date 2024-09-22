import chatModel from "../modules/chatModel.js";
import userModel from "../modules/userModel.js";

export const chatAccessAndCreateController = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(500).send({ message: "userId required for accessing chat" });
    }

    var isChat = await chatModel
      .find({
        isGroupChat: false,
        $and: [
          {
            users: { $elemMatch: { $eq: req.user._id } },
          },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      })
      .populate("users", "-password")
      .populate("latestMessage");

    isChat = await userModel.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    if (isChat.length > 0) {
      return res.status(200).send({
        success: true,
        isChat,
      });
    } else {
      const createChat = await chatModel.create({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });

      const fullChat = await chatModel
        .findOne({ _id: createChat._id })
        .populate("users", "-password");
      return res.status(200).send({
        success: true,
        fullChat,
      });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while accessing or creating chat",
      error,
    });
  }
};

export const chatFetchController = async (req, res) => {
  try {
    var fetchChat = await chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    fetchChat = await chatModel.populate(fetchChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).send({
      success: true,
      message: "Successfully fetched chats",
      fetchChat,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while fetching chat",
      error,
    });
  }
};

export const removeChatController = async (req, res) => {
  try {
    const { chats } = req.body;

    await chatModel.deleteMany({ _id: { $in: chats } });

    res.status(200).send({
      success: true,
      message: "Successfully deleted chats",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while removing chats",
      error,
    });
  }
};

export const createGroupChat = async (req, res) => {
  try {
    console.log(req.body.name);
    console.log(req.body.users);
    if (!req.body.name || !req.body.users) {
      return res.status(500).send({
        success: false,
        message: "Please fill all the fields",
      });
    }

    var users = req.body.users;
    console.log(users);

    if (users.length < 2) {
      return res.status(500).send({
        success: false,
        message: "Atleast 2 users required to form a group",
      });
    }

    users.push(req.user._id);

    const createGroup = await chatModel.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user._id,
    });

    const groupChat = await chatModel
      .findOne({ _id: createGroup._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({
      success: true,
      message: "Successfully created group",
      groupChat,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while creating group chat",
      error,
    });
  }
};

export const renameGroupController = async (req, res) => {
  try {
    const { chatName, chatId } = req.body;
    if (!chatName) {
      return res.status(500).send({
        success: false,
        message: "To rename group field should contain atleast 1 character",
      });
    }

    const renameGroup = await chatModel
      .findByIdAndUpdate(chatId, { chatName }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({
      success: true,
      message: "Successfully renamed group",
      renameGroup,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while renaming group chat",
      error,
    });
  }
};

export const addParticipantToGroupController = async (req, res) => {
  try {
    const { userId, chatId } = req.body;
    if (!userId || !chatId) {
      return res.status(500).send({
        success: false,
        message: "Error in adding participant to group",
      });
    }

    const addedParticipant = await chatModel
      .findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({
      success: true,
      message: "Successfully added participant to group",
      addedParticipant,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in adding participant to group",
      error,
    });
  }
};

export const removeParticipantFromGroupController = async (req, res) => {
  try {
    const { userId, chatId } = req.body;
    if (!userId || !chatId) {
      return res.status(500).send({
        success: false,
        message: "Error in removing participant to group",
      });
    }

    const removeParticipant = await chatModel
      .findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send({
      success: true,
      message: "Successfully remove participant from group",
      removeParticipant,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in removing participant to group",
      error,
    });
  }
};
