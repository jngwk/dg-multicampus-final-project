import React from "react";
import Layout from "../components/shared/Layout";
import Chatlist from "../components/chat/Chatlist";
import Chatting from "../components/chat/Chatting";
import { IoChatbubbles } from "react-icons/io5";

export default function ChatRoom() {
    return (
      <Layout>
        <div className="flex px-7 pt-5">
          <IoChatbubbles color="#ffbe98" size="56"/> 
          <span className="font-semibold text-2xl ml-3 mt-3"> 득-근 CHAT </span> 
        </div>
        <div className="ChatContainer flex py-7 px-10">
          {/* columns주기 */}
          <Chatlist/>
          
          <Chatting/>
        </div>
      </Layout>
    );
  }