import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <>
      <div
        key={user?._id}
        onClick={handleFunction}
        className="h-[4rem] w-full flex items-center  flex-grow hover:scale-105 hover:shadow-2xl my-1 bg-lightgray duration-300 rounded-lg cursor-pointer mx-2   font-poppins   px-2   flex "
      >
        <img
          className=" border border-green w-[3rem] h-[3rem] rounded-full mx-3 my-1.5"
          src={user?.pic}
          alt="user-image"
        />
        <div className=" flex flex-col justify-center">
          <span className="">{user?.name}</span>
          <span className="text-sm font-semibold">
            Email: <span className="font-normal">{user?.email}</span>
          </span>
        </div>
      </div>
    </>
  );
};

export default UserListItem;
