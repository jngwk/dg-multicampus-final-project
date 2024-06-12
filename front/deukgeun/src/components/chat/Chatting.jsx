import React, { useState ,useRef, useEffect } from "react";
import Clock from "react-live-clock";
import { FaAngleLeft, FaRegCalendarPlus } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { TbLayoutSidebarLeftCollapseFilled,TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import {GiGymBag} from "react-icons/gi";
import { MdAttachEmail } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";
import ChatMain from "./ChatMain";
import profileImg from "../../assets/profileImg.jpg";



const Chatting = () => {
    const [isback,setIsback]  = useState(false); //뒤로가기
    const [text,setText]=useState(''); //입력할 chat
    const [chat,setChat]=useState([]); //입력한 chat기록
    const messageEndRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false); //userInfo Open/Close

    //input폼 변경된 값 저장 - 계속 업데이트
    const handleChatInput = (e) => {
        setText(e.target.value);
    };


    //전송버튼클릭시 input의 변경된 값을 chat에 저장하고, input을 초기화시킴.
    const handleSubmitBtn = () => {
      if (text.trim() !== "") {
        const newMessage = {
          text: text,
          time: new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        };
        setChat((prevChat) => [...prevChat, newMessage]);
        setText("");
      }
    };

    // Enter클릭으로 전송
    const handleKeyPress = (e) => {
      if (e.key === 'Enter') {
          handleSubmitBtn();
      }
  };

    //마지막 메시지로 이동
    useEffect(() => {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [chat]);

    return (
      <>
        {isback ? (
            <ChatMain />
        ) : (
            <div className="relative flex">
                <div className={`h-[35rem] mx-1 border-2 rounded-lg border-grayish-red ${isOpen ? 'w-4/6' : 'w-full'} transition-width duration-300`}>
                    <div className="flex items-center mx-3 w-68 h-14 border-b-2 border-grayish-red">
                        <button id="backscreen" onClick={() => setIsback(!isback)}>
                          <FaAngleLeft className="m-3" size="22"/>
                        </button>
                        <span className="text-sm font-medium"> 등록된 헬스장 이름 | 회원 이름 </span>
                        <button className="ml-auto m-1" onClick={() => setIsOpen(!isOpen)}>
                                {isOpen ? (
                                    <TbLayoutSidebarRightCollapseFilled size="25" color="#4E4C4F" />
                                ) : (
                                    <TbLayoutSidebarLeftCollapseFilled size="25" color="#4E4C4F" />
                                )}
                        </button>
                    </div>

                    <article className="w-full h-[27rem] mx-3 overflow-y-scroll scrollbar-hide md:scrollbar-default">
                      <div className="text-xs font-thin">
                          <span className="flex justify-center">
                          <Clock className="w-1/5 my-1 text-center rounded-xl bg-grayish-red text-white" format={' YYYY년 MM월 DD일 '} ticking={false} timezone={"Asia/Seoul"} />
                          </span>
                      </div>

                      <section>
                          {<ShowChatList chatList={chat} />}
                      </section>

                      <div ref={messageEndRef}></div>
                    </article>

                    <div className="mt-2 mx-3 w-68 h-11 border-y-2 border-grayish-red">
                      <div className="flex space-x-3 m-2">
                          <button ><FaRegCalendarPlus size="24" color="#4E4C4F"/></button>
                          <input className="w-full outline-none" type="text" onChange={handleChatInput} value={text} onKeyPress={handleKeyPress}></input>
                          <button type="button" onClick={handleSubmitBtn}><LuSend size="24" color="#4E4C4F"/></button>
                      </div>
                    </div>
                </div>

                {isOpen && (
                        <div className={`flex flex-col justify-center items-center w-2/6 h-[35rem] mx-1 border-2 rounded-lg border-grayish-red transition-transform duration-300`}>
                            <div className="p-3 flex flex-col items-center ">
                                <img className="w-24 h-24 rounded-full object-cover" src={profileImg} alt="profile" />
                                <div className="text-sm font-semibold p-3"> 최OO 회원님 </div>
                            </div>

                            <div className="p-3 text-sm">
                                <div className="flex items-center whitespace-pre-line m-2 p-2"><GiGymBag className="mr-10" size="28" /> 
                                    <div className="flex-col">
                                      <p className="text-sm">헬스장</p>
                                      <p className="text-xs">바디채널 OO점</p>
                                    </div>
                                </div>
                                <div className="flex items-center whitespace-pre-line m-2 p-2"><MdAttachEmail className="mr-10" size="28"/> 
                                    <div className="flex-col">
                                      <p className="text-sm">이메일</p>
                                      <p className="text-xs">Choi123@naver.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center whitespace-pre-line m-2 p-2"><FaMapLocationDot className="mr-10" size="28"/> 
                                    <div className="flex-col">
                                      <p className="text-sm">주소</p>
                                      <p className="text-xs">서울특별시 강남구</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        )}
    </>
  );
};


function ShowChatList({ chatList }) {
  return chatList.map((chat, i) => {
    //마지막 시간만 보이도록 구현
    const nextTime = chatList[i + 1]?.time;
    const showTime = !nextTime || nextTime !== chat.time; 
    return (
      <div key={i}>
        <article>
          <div className="flex items-end justify-end p-1 ">
            {showTime && (
              <span>
                <Clock className="current_time text-xs" format={"A HH:mm"} ticking={false} timezone={"Asia/Seoul"} />
              </span>
            )}
            <p className="ml-3 px-10 py-2 rounded-xl bg-grayish-red bg-opacity-20 max-w-xs max-h-fit text-xs">
              {chat.text}
            </p>
          </div>
        </article>
      </div>
    );
  });
}

export default Chatting;