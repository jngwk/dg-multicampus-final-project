import React, { useState, useRef, useEffect } from "react";
import Clock from "react-live-clock";
import { FaAngleLeft, FaRegCalendarPlus } from "react-icons/fa";
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
}) => {
  const [text, setText] = useState(""); //입력할 chat
  const [chat, setChat] = useState([]); //입력한 chat기록
  const messageEndRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false); //userInfo Open/Close
  const windowSize = useWindowSize();
  // cosnt [recipient, setRecipient ] = useState(chatRoom ? chatRoom.user.userId ?)

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
  }, [messages]);

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
            <span className="text-sm font-medium">
              {" "}
              <span className="inline-block">등록된 헬스장 이름</span> |{" "}
              <span className="inline-block">회원 이름</span>{" "}
            </span>
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

          <article className="flex-grow w-full h-[70%] overflow-y-auto scrollbar-hide sm:hover:scrollbar-default">
            {messagesLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <Loader />
              </div>
            ) : (
              <>
                <section>
                  {<ShowChatList chatList={messages} userData={userData} />}
                </section>
                <div ref={messageEndRef}></div>{" "}
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
              <img
                className="w-24 h-24 rounded-full object-cover"
                src={profileImg}
                alt="profile"
              />
              <div className="text-sm font-semibold p-3"> 최OO 회원님 </div>
            </div>

            <div className="p-3 text-sm">
              <div className="flex items-center whitespace-pre-line m-2 p-2">
                <GiGymBag className="mr-10" size="28" />
                <div className="flex-col">
                  <p className="text-sm">헬스장</p>
                  <p className="text-xs">바디채널 OO점</p>
                </div>
              </div>
              <div className="flex items-center whitespace-pre-line m-2 p-2">
                <MdAttachEmail className="mr-10" size="28" />
                <div className="flex-col">
                  <p className="text-sm">이메일</p>
                  <p className="text-xs">Choi123@naver.com</p>
                </div>
              </div>
              <div className="flex items-center whitespace-pre-line m-2 p-2">
                <FaMapLocationDot className="mr-10" size="28" />
                <div className="flex-col">
                  <p className="text-sm">주소</p>
                  <p className="text-xs">서울특별시 강남구</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

function ShowChatList({ chatList, userData }) {
  return chatList.map((chat, i) => {
    //마지막 시간만 보이도록 구현

    let currentTimestamp = chat.timestamp;
    if (currentTimestamp && typeof currentTimestamp !== "string") {
      currentTimestamp = new Date(currentTimestamp).toISOString();
    }

    const currentDate = currentTimestamp ? parseISO(currentTimestamp) : null;
    const currentTime = currentDate ? format(currentDate, "HH:mm") : "";

    const nextChat = chatList[i + 1];
    let nextTimestamp = nextChat ? nextChat.timestamp : null;
    if (nextTimestamp && typeof nextTimestamp !== "string") {
      // console.log("nextTimestamp", nextTimestamp.toISOString());
      nextTimestamp = new Date(nextTimestamp).toISOString();
    }

    const nextTime = nextTimestamp
      ? format(parseISO(nextTimestamp), "HH:mm")
      : null;
    const showTime = !nextTime || nextTime !== currentTime;

    const showDate =
      i === 0 ||
      (currentDate &&
        nextTimestamp &&
        !isSameDay(currentDate, parseISO(chatList[i - 1].timestamp)));
    // console.log("@@@@@@@@@@@", currentDate, currentTimestamp);

    return (
      <div key={i}>
        {showDate && (
          <div className="text-xs font-thin">
            <span className="flex justify-center">
              <Clock
                date={currentDate}
                className="w-1/5 min-w-32 my-2 text-center rounded-xl bg-grayish-red text-white"
                format={" YYYY년 MM월 DD일 "}
                ticking={false}
                timezone={"Asia/Seoul"}
              />
            </span>
          </div>
        )}
        <div>
          <article>
            <div
              className={`flex ${
                chat.sender.userId === userData.userId
                  ? "flex-end"
                  : "flex-start"
              } items-end justify-end p-1`}
            >
              {showTime && (
                <span>
                  <Clock
                    date={currentDate}
                    className="current_time text-xs"
                    format={"A hh:mm"}
                    ticking={false}
                    timezone={"Asia/Seoul"}
                  />
                </span>
              )}
              <p className="ml-3 px-6 py-2 rounded-xl bg-grayish-red bg-opacity-20 max-w-xs max-h-fit min-h-[32px] text-xs">
                {chat.message}
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  });
}

export default Chatting;
