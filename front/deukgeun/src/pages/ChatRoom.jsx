import React, { useEffect, useState } from "react";
import { IoAddCircle, IoChatbubbles } from "react-icons/io5";
import Chatlist from "../components/chat/Chatlist";
import Chatting from "../components/chat/Chatting";
import ChatMain from "../components/chat/ChatMain";
import useWindowSize from "../hooks/useWindowResize";
import Fallback from "../components/shared/Fallback";
import useChat from "../hooks/useChat";
import Loader from "../components/shared/Loader";
import AvailableUsersModal from "../components/modals/AvailableUsersModal";

export default function ChatRoom() {
  const [isMainVisible, setIsMainVisible] = useState(true); // 메인화면 보이는지
  const [isChatListVisible, setIsChatListVisible] = useState(true); // 채팅방 목록 보이는지
  const [isChatVisible, setIsChatVisible] = useState(false); // 채팅 보이는지
  const [chatReceiver, setChatReceiver] = useState("");
  const [latestMessages, setLatestMessages] = useState([]);
  const windowSize = useWindowSize(); // 반응형을 위한 custom hook
  const {
    messages,
    chatRooms,
    chatRoom,
    setChatRoom,
    chatMessage,
    setChatMessage,
    availableUsers,
    isAvailableUsersModalVisible,
    messagesLoading,
    availableUsersLoading,
    loading,
    userData,
    findOrCreateChatRoom,
    sendMessage,
    toggleAvailableUsersModal,
  } = useChat();

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

  const handleChatListClick = (room) => {
    if (windowSize.width >= 768) {
      setIsMainVisible(false);
      setIsChatVisible(true);
    } else {
      setIsChatVisible(true);
      setIsChatListVisible(false);
    }
    setChatReceiver(
      room.users[0].userId === userData.userId ? room.users[1] : room.users[0]
    );
    setChatRoom(room);
  };

  const handleNewChatClick = async (receiverId) => {
    const newChatRoom = await findOrCreateChatRoom(receiverId);
    console.log("newChatRoom @@@@@@@@", newChatRoom);
    handleChatListClick(newChatRoom);
  };
  // console.log("from chat Room", isAvailableUsersModalVisible);

  if (loading) {
    return <Fallback />;
  }

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
            {chatRooms &&
              (chatRooms.length > 0 ? (
                chatRooms.map((room, index) => (
                  <div
                    key={index}
                    className="w-full cursor-pointer"
                    onClick={() => handleChatListClick(room)}
                  >
                    {room.users.length === 2 && (
                      <Chatlist
                        user={
                          room.users[0].userId === userData.userId
                            ? room.users[1]
                            : room.users[0]
                        }
                      />
                    )}
                  </div>
                ))
              ) : chatRooms.length === 0 ? (
                "대화 가능한 상대가 없습니다. 추가 후 대화를 시작해주세요."
              ) : (
                <Loader />
              ))}
          </div>
        </div>
        {isMainVisible && !isChatVisible && (
          <ChatMain toggleModal={toggleAvailableUsersModal} />
        )}
        {isChatVisible && !isMainVisible && (
          <Chatting
            setIsChatListVisible={setIsChatListVisible}
            setIsChatVisible={setIsChatVisible}
            setIsMainVisible={setIsMainVisible}
            messages={messages}
            chatRoom={chatRoom}
            chatMessage={chatMessage}
            setChatMessage={setChatMessage}
            messagesLoading={messagesLoading}
            sendMessage={sendMessage}
            userData={userData}
            chatReceiver={chatReceiver}
          />
        )}
      </div>
      {isAvailableUsersModalVisible && (
        <AvailableUsersModal
          availableUsersLoading={availableUsersLoading}
          availableUsers={availableUsers}
          userData={userData}
          toggleModal={toggleAvailableUsersModal}
          handleButtonClick={handleNewChatClick}
        />
      )}
    </div>
  );
}
