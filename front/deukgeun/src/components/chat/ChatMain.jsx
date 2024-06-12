import React from "react";
import { IoChatbubbles} from "react-icons/io5";


const ChatMain = () => {

    return (
        <div className="flex flex-col justify-center items-center relative w-full h-[35rem] mx-1 border-2 rounded-lg border-grayish-red">
            <IoChatbubbles className="p-1 border-2 border-light-gray rounded-full"color="#ffbe98" size="52"/> 
            <span className="mt-3 text-xs text-center">헬스장 회원과 
                <br></br>트레이너와의 채팅 시작하기</span>
            <button className="m-3 text-xs bg-grayish-red bg-opacity-50 w-28 h-7 rounded-lg hover:border-grayish-red hover:border-2 hover:bg-light-gray hover:border-opacity-50">
                메세지 보내기
            </button>
            
        </div>
    );
};


export default ChatMain;