import React, { useEffect, useState } from "react";
import profileImg from "../../assets/profileImg.jpg";

const Chatlist = ({ user, latestMessage, room }) => {
  // console.log("Chat list data passed in", data);
  const roles = {
    ROLE_GENERAL: "회원",
    ROLE_GYM: "헬스장",
    ROLE_TRAINER: "트레이너",
  };
  const [state, setState] = useState(latestMessage ? latestMessage : "");
  useEffect(() => {
    // if (state === latestMessage) return;
    setState(latestMessage);
  }, [latestMessage, room]);
  return (
    <div className="flex justify-between items-center h-[4.5rem] border-0 shadow-lg rounded-xl py-2 px-3 border-light-gray bg-white">
      <div className=" w-10 h-10 flex justify-center items-center">
        {user.userImage ? (
          <div className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center">
            <img
              // className="object-"
              src={`/images/${user.userImage.userImage}`}
            />
          </div>
        ) : (
          <box-icon
            name="user-circle"
            type="solid"
            size="md"
            color="#9f8d8d"
          ></box-icon>
        )}
      </div>
      <div className="px-4 py-2 w-full space-y-1">
        {/*선택한 회원 이름 가져오기*/}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold overflow-hidden text-ellipsis">
            {user.userName}
          </span>
          <span className="text-xs">{roles[user.role]}</span>
        </div>
        {/* 마지막 메시지 가져오기 */}
        <p className="text-xs max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
          {state}
        </p>
      </div>
    </div>
  );
};

export default Chatlist;
