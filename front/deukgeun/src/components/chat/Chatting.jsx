import React, { useState ,useRef, useEffect } from "react";
import Clock from "react-live-clock";
import { FaAngleLeft, FaRegCalendarPlus } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { RiAttachment2 } from "react-icons/ri";


const Chatting = () => {

    const [text,setText]=useState(''); //입력할 chat
    const [chat,setChat]=useState([]); //입력한 chat기록
    const messageEndRef = useRef(null);

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
        <div className=" relative w-11/12 h-[35rem] mx-1 border-2 rounded-lg border-grayish-red">
            <div className="flex items-center mx-3 w-68 h-14 border-b-2 border-grayish-red">
                <FaAngleLeft className="m-3"/>
                <span className="text-sm font-medium"> 등록된 헬스장 이름 | 회원 이름 </span>
            </div>

            <article className="w-full h-[27rem] mx-3 overflow-y-scroll scrollbar-hide md:scrollbar-default" >
              <div className="text-sm font-thin" > 
                  
                  <span className="flex justify-center">
                  <Clock className="w-1/5 my-1 text-center rounded-xl bg-grayish-red text-white " format={' YYYY년 MM월 DD일 '} ticking={false} timezone={"Asia/Seoul"} />
                  </span>
                  
              </div>

              <section>
                  {<ShowChatList chatList={chat} />}
              </section>

              <div ref={messageEndRef}></div>
            </article>

           <div className= "mt-2 mx-3 w-68 h-11 border-y-2 border-grayish-red">
                    <div className="flex space-x-3 m-2">
                        <button ><FaRegCalendarPlus size="24" color="#4E4C4F"/></button>
                        <button><RiAttachment2 size="24" color="#4E4C4F"/></button>
                        <input className=" w-full outline-none " type="text" onChange={handleChatInput} value={text} onKeyPress={handleKeyPress} ></input>
                        <button  type="button" onClick={handleSubmitBtn} ><LuSend size="24" color="#4E4C4F"/></button>
                    </div>
            </div>
        </div>
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