import React from "react";
import Input from "../shared/Input";
import { FaAngleLeft } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const Chatting = () => {

    return (
        <div className=" relative w-3/6 h-[32rem] mx-10 border-2 rounded-lg">
            <div>
                <FaAngleLeft className="absolute left-4 top-4"/>
                등록된 헬스장 이름 | 회원 이름
                <IoClose/>
            </div>
            

            <div className= "absolute left-4 bottom-1">
                <Input width="685px" height="80px"></Input>
            </div>
        </div>
    );


};


export default Chatting;