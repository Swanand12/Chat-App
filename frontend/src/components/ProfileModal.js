import React from "react";

import { Modal } from "antd";

const ProfileModal = ({ showProfile, setShowProfile, user }) => {
  return (
    <Modal
      open={showProfile}
      onCancel={() => setShowProfile(false)}
      footer={null}
    >
      <div className="flex flex-col py-4 items-center bg-gray">
        <h1 className="my-2 font-poppins text-2xl text-green font-semibold">
          Profile
        </h1>
        <img
          className="rounded-full hover:shadow-lg m-3 w-[6rem] h-[6rem] border border-green mx-2 my-1.5"
          src={user?.pic}
          alt="user-image"
        />
        <span className="my-2 font-semibold text-lg font-poppins ">
          {user?.name}
        </span>
        <span className="">{user?.email}</span>
      </div>
    </Modal>
  );
};

export default ProfileModal;
