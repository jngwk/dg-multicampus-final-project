import React from "react";
import Layout from "../components/shared/Layout";
import { IoChatbubbles } from "react-icons/io5";

export default function Main() {
    return (
      <Layout>
        <div className="flex p-7">
          <IoChatbubbles color="#FFBE98" size="56"/> 
          <span className="font-semibold text-2xl mt-2"> 득-근 CHAT </span> 
        </div>
        <div className="ChatContainer p-2">
          채팅 목록 | 채팅창 | 상대정보
          <div className="ChatlistContainer">

          </div>
        </div>
      </Layout>
    );
  }