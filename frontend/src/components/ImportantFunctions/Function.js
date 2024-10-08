export const getSender = (selectedChat, auth) => {
  if (!selectedChat) return null;
  if (selectedChat.isGroupChat) return null;

  const users = selectedChat.users;
  if (!users || users.length < 2) return null;

  return users[0]._id === auth?.user?._id ? users[1] : users[0];
};

export const getSenderName = (selectedChat, auth) => {
  if (!selectedChat) return null;
  if (selectedChat.isGroupChat) return selectedChat.chatName;

  const users = selectedChat.users;
  if (!users || users.length < 2) return null;

  return users[0]._id === auth?.user?._id ? users[1].name : users[0].name;
};

export const getSenderPic = (selectedChat, auth) => {
  if (!selectedChat) return null;
  if (selectedChat.isGroupChat)
    return "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";

  const users = selectedChat.users;
  if (!users || users.length < 2) return null;

  return users[0]._id === auth?.user?._id ? users[1].pic : users[0].pic;
};

export const capitalizeWords = (str) => {
  if (!str || typeof str !== "string") return;
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getSenderEmail = (selectedChat, auth) => {
  if (!selectedChat) return null;
  if (selectedChat.isGroupChat) return selectedChat.chatName;

  const users = selectedChat.users;
  if (!users || users.length < 2) return null;

  return users[0]._id === auth?.user?._id ? users[1].email : users[0].email;
};

export const getLatestMessageOrEmail = (mychat, auth) => {
  const you = "You: ";
  if (mychat.latestMessage) {
    return mychat.latestMessage.sender.name === auth.user.name
      ? you +
          (mychat?.latestMessage?.content !== undefined
            ? mychat?.latestMessage?.content.length > 30
              ? mychat?.latestMessage?.content.substring(0, 20) + "..."
              : mychat?.latestMessage?.content
            : "")
      : mychat.latestMessage.sender.name +
          ": " +
          (mychat?.latestMessage?.content !== undefined
            ? mychat?.latestMessage?.content.length > 30
              ? mychat?.latestMessage?.content.substring(0, 20) + "..."
              : mychat?.latestMessage?.content
            : "");
  } else {
    return getSenderEmail(mychat, auth);
  }
};

export const getNotificationNum = (notification) => {
  if (!Array.isArray(notification)) {
    return 0; // Return 0 if notification is not an array or is undefined/null
  }

  let uniqueid = new Set(notification.map((n) => n.chat._id));

  return uniqueid.size;
};

export const getIndividualNotificationNum = (mychat, notification) => {
  if (!Array.isArray(notification)) {
    return 0; // Return 0 if notification is not an array or is undefined/null
  }
  var array = [];
  array = notification.filter((n) => n.chat._id === mychat._id);
  return array.length;
};
