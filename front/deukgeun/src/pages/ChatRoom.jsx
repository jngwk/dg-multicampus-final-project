import React from 'react';
import useChangeMsg from "../hooks/useChangeMsg"
import Chatlist from "../components/chat/Chatlist";
import Chatting from "../components/chat/Chatting";
import ChatMain from '../components/chat/ChatMain';
import { IoChatbubbles, IoAddCircle  } from "react-icons/io5";




export default function ChatRoom() {
    const { viewmsg, ChangeMsg} = useChangeMsg();

    return (
        <div className="w-full py-5">
          <div className="flex items-center w-[920px]  pb-2 ">
            <IoChatbubbles color="#ffbe98" size="56"/> 
            <span className="font-semibold text-2xl mx-3 "> 득-근 CHAT </span>
            <button><IoAddCircle color='#E6E6E6' size="28"/></button>
          </div>
          
          <div className="ChatContainer flex justify-center px-2">
            {/* columns주고 여러개 */}
            <div className="w-2/6 h-[35rem] mx-8 border-none rounded-lg bg-peach-fuzz bg-opacity-20">
              <div className="flex-col space-y-4 overflow-y-scroll overflow-x-hidden h-[35rem] w-full pl-4 py-2 scrollbar-hide md:scrollbar-default">
                <button className="w-full" onClick={() => ChangeMsg(true)}>
                  <Chatlist/>
                </button>
              </div>
            </div>
              {/* chatMain으로 시작 후 메시지 보내기 클릭 시 Chatting창으로  */}
              
              {viewmsg? <ChatMain/> : <Chatting/> }

          </div>
        </div>      
    );
  }