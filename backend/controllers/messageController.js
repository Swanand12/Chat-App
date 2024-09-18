import chatModel from "../modules/chatModel.js";
import messageModel from "../modules/messageModel.js";
import userModel from "../modules/userModel.js";

export const sendMessageController = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).send({
        success: false,
        message: "Content and ChatId is required",
      });
    }

    var date = new Date().toLocaleTimeString();
    date = date.slice(0, 5) + " " + date.slice(8);

    var message = await messageModel.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
      time: date,
    });

    await message.populate("sender", "name pic email");
    await message.populate("chat");

    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await chatModel.findByIdAndUpdate(chatId, { latestMessage: message._id });

    res.status(200).send({
      success: true,

      message,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while sending message",
      error,
    });
  }
};

export const fetchMessagesController = async (req, res) => {
  try {
    const { chatId } = req.body;

    var messages = await messageModel
      .find({ chat: chatId })
      .populate("sender")
      .populate("chat");

    messages = await userModel.populate(messages, {
      path: "chat.users",
      select: "name pic email",
    });

    res.status(200).send({
      success: true,
      message: "Successfully fetched all the messages",
      messages: messages,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while fetching message",
      error,
    });
  }
};
