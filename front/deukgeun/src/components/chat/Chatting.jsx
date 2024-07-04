import React, { useState, useRef, useEffect } from "react";
import Clock from "react-live-clock";
import { FaAngleLeft, FaRegCalendarPlus } from "react-icons/fa";
import Bprofile from "../../assets/blank_profile.png";

import { LuSend } from "react-icons/lu";
import {
  TbLayoutSidebarLeftCollapseFilled,
  TbLayoutSidebarRightCollapseFilled,
} from "react-icons/tb";
import { GiGymBag } from "react-icons/gi";
import { MdAttachEmail } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import profileImg from "../../assets/profileImg.jpg";
import useWindowSize from "../../hooks/useWindowResize";
import Loader from "../shared/Loader";
import { format, isSameDay, parseISO } from "date-fns";
import { getImage, getImageById } from "../../api/userInfoApi";
import useProfileImage from "../../hooks/useProfileImage";
import { getTrainerById } from "../../api/trainerApi";

const Chatting = ({
  setIsChatVisible,
  setIsChatListVisible,
  setIsMainVisible,
  messages, // 대화내역
  chatRoom, // 채팅방 이름 밑 상대방 이름을 위함
  chatMessage,
  setChatMessage, // 입력 메세지
  messagesLoading, // 대화 내역 로딩 상태
  sendMessage,
  userData, // 메세지 전송
  chatReceiver,
}) => {
  const messageEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false); //userInfo Open/Close
  const windowSize = useWindowSize();
  // const [recipient, setRecipient ] = useState(chatRoom ? chatRoom.user.userId ?)
  const { userImage, fetchUserImage } = useProfileImage();
  const [gymName, setGymName] = useState();
  const roles = {
    ROLE_GENERAL: "회원",
    ROLE_GYM: "헬스장",
    ROLE_TRAINER: "트레이너",
  };

  // Enter클릭으로 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // handleSubmitBtn();
      sendMessage();
    }
  };

  // 뒤로가기 버튼 클릭시
  // 반응형을 위한 함수
  const handleBackButtonClick = () => {
    if (windowSize.width < 768) {
      setIsChatVisible(false);
      setIsChatListVisible(true);
    } else {
      setIsChatVisible(false);
      setIsMainVisible(true);
    }
  };

  //마지막 메시지로 이동
  useEffect(() => {
    messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    console.log("chat receiver", chatReceiver);
  }, [messages]);

  useEffect(() => {
    const getTrainer = async (id) => {
      try {
        const trainer = await getTrainerById(id);
        console.log("trainer in chat", trainer);
        if (trainer) setGymName(trainer.gym.user.userName);
      } catch (error) {
        console.log("error fetching trainer");
      }
    };
    if (chatReceiver.role === "ROLE_TRAINER") {
      getTrainer(chatReceiver.userId);
    }
  }, [chatReceiver]);

  return (
    <>
      <div className="relative flex h-full w-full">
        <div
          className={`flex flex-col px-3 border-2 rounded-lg border-grayish-red ${
            isOpen ? "w-4/6" : "w-full"
          } transition-width duration-300`}
        >
          <div className="flex items-center w-full h-14 border-b-2 border-grayish-red">
            <button id="backscreen" onClick={handleBackButtonClick}>
              <FaAngleLeft className="m-3" size="22" />
            </button>
            <div className="flex items-center gap-2">
              {/* TODO 헬스장 이름 추가 */}
              <span className="inline-block font-semibold">
                {chatReceiver.userName}
              </span>
              {"|"}
              <span className="inline-block text-sm text-gray-700">
                {roles[chatReceiver.role]}
              </span>
            </div>
            <button
              className="hidden lg:block ml-auto m-1"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <TbLayoutSidebarRightCollapseFilled size="25" color="#4E4C4F" />
              ) : (
                <TbLayoutSidebarLeftCollapseFilled size="25" color="#4E4C4F" />
              )}
            </button>
          </div>

          <article className="flex-grow w-full h-[70%] overflow-y-auto">
            {messagesLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <>
                <section>
                  {<ShowChatList chatList={messages} userData={userData} />}
                </section>
                <div ref={messageEndRef}></div>
              </>
            )}
          </article>
          <div className="w-full h-14 flex items-center">
            <div className="w-full h-11 border-y-2 border-grayish-red">
              <div className="flex space-x-3 m-2">
                <button>
                  <FaRegCalendarPlus size="24" color="#4E4C4F" />
                </button>
                <input
                  className="w-full outline-none"
                  type="text"
                  onChange={(e) => setChatMessage(e.target.value)}
                  value={chatMessage}
                  onKeyPress={handleKeyPress}
                ></input>
                <button type="button" onClick={sendMessage}>
                  <LuSend size="24" color="#4E4C4F" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isOpen && (
          <div
            className={`flex flex-col justify-center items-center ${
              isOpen ? "w-2/6" : "w-0"
            } mx-1 border-2 rounded-lg border-grayish-red transition-all duration-300`}
          >
            <div className="p-3 flex flex-col items-center ">
              {chatReceiver.userImage ? (
                <img
                  className="w-24 h-24 rounded-full object-cover"
                  src={`images/${chatReceiver.userImage.userImage}`}
                  alt="profile"
                />
              ) : (
                <box-icon
                  name="user-circle"
                  type="solid"
                  size="lg"
                  color="#9f8d8d"
                  style={{ width: "112px", height: "112px" }}
                ></box-icon>
              )}
              <div className="text-sm font-semibold p-3">
                {chatReceiver.userName}
              </div>
            </div>

            <div className="p-3 text-sm">
              {chatReceiver.role === "ROLE_TRAINER" && (
                <div className="flex items-center whitespace-pre-line m-2 p-2">
                  <GiGymBag className="mr-10" size="28" />
                  <div className="flex-col">
                    <p className="text-sm">헬스장</p>
                    <p className="text-xs">{gymName}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center whitespace-pre-line m-2 p-2">
                <MdAttachEmail className="mr-10" size="28" />
                <div className="flex-col">
                  <p className="text-sm">이메일</p>
                  <p className="text-xs">{chatReceiver.email}</p>
                </div>
              </div>
              <div className="flex items-center whitespace-pre-line m-2 p-2">
                <FaMapLocationDot className="mr-10" size="28" />
                <div className="flex-col">
                  <p className="text-sm">주소</p>
                  <p className="text-xs">{chatReceiver.address}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// array 타입인 날짜를 변경
const arrayToDate = (arr) => {
  if (Array.isArray(arr) && arr.length >= 6) {
    return new Date(
      arr[0], // year
      arr[1] - 1, // month
      arr[2], // day
      arr[3], // hour
      arr[4], // minute
      arr[5] // second
    );
  }
  return null;
};

function ShowChatList({ chatList, userData }) {
  return chatList.map((chat, i) => {
    //마지막 시간만 보이도록 구현
    // console.log(i, chat);
    let currentTimestamp = chat.timestamp;
    if (Array.isArray(currentTimestamp)) {
      currentTimestamp = arrayToDate(currentTimestamp).toISOString();
    } else if (currentTimestamp && typeof currentTimestamp !== "string") {
      currentTimestamp = new Date(currentTimestamp).toISOString();
    }

    const currentDate = currentTimestamp ? parseISO(currentTimestamp) : null;
    const currentTime = currentDate ? format(currentDate, "HH:mm") : "";

    const nextChat = chatList[i + 1];
    let nextTimestamp = nextChat ? nextChat.timestamp : null;
    if (Array.isArray(nextTimestamp)) {
      nextTimestamp = arrayToDate(nextTimestamp).toISOString();
    } else if (nextTimestamp && typeof nextTimestamp !== "string") {
      nextTimestamp = new Date(nextTimestamp).toISOString();
    }

    const nextTime = nextTimestamp
      ? format(parseISO(nextTimestamp), "HH:mm")
      : null;
    // console.log(chatList[i + 1]);
    const showTime =
      (nextChat && chat.sender.userId !== nextChat.sender.userId) ||
      !nextTime ||
      nextTime !== currentTime;

    const prevChat = chatList[i - 1];
    let prevTimestamp = prevChat ? prevChat.timestamp : null;
    if (Array.isArray(prevTimestamp)) {
      prevTimestamp = arrayToDate(prevTimestamp).toISOString();
    } else if (prevTimestamp && typeof prevTimestamp !== "string") {
      prevTimestamp = new Date(prevTimestamp).toISOString();
    }
    const showDate =
      i === 0 ||
      (currentDate && !isSameDay(currentDate, parseISO(prevTimestamp)));

    return (
      <div key={i}>
        {showDate && (
          <div className="text-xs font-thin">
            <span className="flex justify-center">
              <Clock
                date={currentTimestamp}
                className="w-1/5 min-w-32 my-2 text-center rounded-xl bg-grayish-red text-white"
                format={"YYYY년 MM월 DD일"}
                ticking={false}
                timezone={"Asia/Seoul"}
              />
            </span>
          </div>
        )}
        <article>
          <div
            className={`flex items-end justify-end p-1 ${
              chat.sender.userId !== userData.userId && "flex-row-reverse"
            }`}
          >
            {showTime && (
              <span>
                <Clock
                  date={currentTimestamp}
                  className="current_time text-xs"
                  format={"HH:mm"}
                  ticking={false}
                  timezone={"Asia/Seoul"}
                />
              </span>
            )}
            <p className="mx-3 px-6 py-2 rounded-xl bg-grayish-red bg-opacity-20 max-w-xs max-h-fit min-h-[32px] text-xs">
              {chat.message}
            </p>
          </div>
        </article>
      </div>
    );
  });
}

export default Chatting;
