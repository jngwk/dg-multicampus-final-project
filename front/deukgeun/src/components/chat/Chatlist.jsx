import React from "react";
import profileImg from "../../assets/profileImg.jpg";

const Chatlist = () => {

    return (
        <div className=" flex w-80 h-[4.5rem] border-2 shadow-lg rounded-xl py-2 pl-7 ">
            <img className=" w-12 h-12 rounded-full object-cover " src={profileImg} />
            <div className="ml-4 my-2">
                <p className="flex align-middle text-center text-sm"> 최OO 회원님</p> 
                <p className="text-xs max-w-[180px] overflow-hidden text-ellipsis whitespace-nowrap"> 저 어제 피자 먹었어요 ㅎㅎㅎㅎㅎㅎ </p> 
            </div>
        </div>
    );
};


export default Chatlist;