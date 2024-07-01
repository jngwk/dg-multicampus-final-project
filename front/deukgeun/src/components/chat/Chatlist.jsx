import React, { useEffect, useState } from "react";
import profileImg from "../../assets/profileImg.jpg";

const Chatlist = ({ userName, latestMessage, room }) => {
  // console.log("Chat list data passed in", data);
  const [state, setState] = useState(latestMessage ? latestMessage : "");
  useEffect(() => {
    // if (state === latestMessage) return;
    setState(latestMessage);
  });
  return (
    <div className="flex justify-center items-center h-[4.5rem] border-0 shadow-lg rounded-xl py-2 border-light-gray bg-white">
      {/* <img className=" w-10 h-10 rounded-full object-cover " src={profileImg} /> */}
      <div className="px-4 py-2 w-full">
        {/*선택한 회원 이름 가져오기*/}
        <p className="flex align-middle text-center text-xs font-semibold ">
          {userName}
        </p>
        {/* 마지막 메시지 가져오기 */}
        <p className="text-xs max-w-[150px] overflow-hidden text-ellipsis whitespace-nowrap">
          {state}
        </p>
      </div>
    </div>
  );
};

export default Chatlist;
