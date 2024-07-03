import React from "react";
import { IoChatbubbles } from "react-icons/io5";

const ChatMain = ({ toggleModal }) => {
  return (
    <div className="flex flex-col justify-center items-center relative w-full h-full mx-1 border-2 rounded-lg border-grayish-red">
      <IoChatbubbles
        className="p-1 border-2 border-light-gray rounded-full"
        color="#ffbe98"
        size="52"
      />
      {/* <span className="mt-3 text-xs text-center">채팅 시작하기</span> */}
      <button
        className="m-3 text-xs bg-grayish-red bg-opacity-50 w-28 h-7 rounded-lg hover:border-grayish-red hover:border-2 hover:bg-light-gray hover:border-opacity-50"
        onClick={toggleModal}
      >
        채팅 시작하기
      </button>
    </div>
  );
};

export default ChatMain;
