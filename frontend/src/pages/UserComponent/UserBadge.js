import React from "react";
import { RxCross2 } from "react-icons/rx";

const UserBadge = ({ userToAdd, handleFunction }) => {
  return (
    <button
      className="py-1 px-2 mx-2 my-1 rounded-lg bg-green flex items-center text-white font-poppins"
      type="button"
      onClick={handleFunction}
    >
      {userToAdd.name}
      <RxCross2 className="ml-1" />
    </button>
  );
};

export default UserBadge;
