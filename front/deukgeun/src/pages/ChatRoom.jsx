import React, { useEffect, useState } from "react";
import useChangeMsg from "../hooks/useChangeMsg";
import Chatlist from "../components/chat/Chatlist";
import Chatting from "../components/chat/Chatting";
import ChatMain from "../components/chat/ChatMain";
import { IoChatbubbles, IoAddCircle } from "react-icons/io5";
import useWindowSize from "../hooks/useWindowResize";

export default function ChatRoom() {
  const [isMainVisible, setIsMainVisible] = useState(true); // 메인화면 보이는지
  const [isChatListVisible, setIsChatListVisible] = useState(true); // 채팅방 목록 보이는지
  const [isChatVisible, setIsChatVisible] = useState(false); // 채팅 보이는지
  const windowSize = useWindowSize(); // 반응형을 위한 custom hook

  // 반응형을 위한 effect
  useEffect(() => {
    getChatListDisplay();
    if (windowSize.width < 768) {
      !isChatVisible ? setIsMainVisible(false) : setIsMainVisible(true);
    }
    if (windowSize.width >= 768) {
      isMainVisible ? setIsChatVisible(false) : setIsChatVisible(true);
    }
  }, [windowSize.width, windowSize.height]);

  // 반응형을 위한 함수
  const getChatListDisplay = () => {
    return isChatListVisible ? "" : "hidden";
  };

  const handleChatListClick = () => {
    if (windowSize.width >= 768) {
      setIsMainVisible(false);
      setIsChatVisible(true);
    } else {
      setIsChatVisible(true);
      setIsChatListVisible(false);
    }
  };
  return (
    <div className="w-full max-w-[1400px] py-5">
      <div className="md:flex items-center pb-2 ml-10">
        <IoChatbubbles color="#ffbe98" size="56" />
        <span className="font-semibold text-2xl mx-3 "> 득-근 CHAT </span>
        <button>
          <IoAddCircle color="#E6E6E6" size="28" />
        </button>
      </div>

      <div className="ChatContainer h-[70dvh] flex justify-center px-2">
        {/* columns주고 여러개  - ChatList*/}
        <div
          className={`${getChatListDisplay()} w-4/5 md:w-1/5 min-w-[260px] mx-8 border-none rounded-lg bg-peach-fuzz bg-opacity-20`}
        >
          <div className="flex-col space-y-4 overflow-y-auto overflow-x-hidden w-full h-full px-4 py-2 scrollbar-hide hover:scrollbar-default">
            <div
              className="w-full cursor-pointer"
              onClick={handleChatListClick}
            >
              <Chatlist />
            </div>
          </div>
        </div>
        {isMainVisible && !isChatVisible && <ChatMain />}
        {isChatVisible && !isMainVisible && (
          <Chatting
            setIsChatListVisible={setIsChatListVisible}
            setIsChatVisible={setIsChatVisible}
            setIsMainVisible={setIsMainVisible}
          />
        )}
      </div>
    </div>
  );
}
