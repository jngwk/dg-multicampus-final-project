import React from "react";
import { GiGymBag } from "react-icons/gi";
import { MdAttachEmail } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";




const ChatUserInfo = () => {

    return (
        <div className=" relative w-2/6 h-[35rem] mx-1 border-2 rounded-lg border-grayish-red">
            <div>
            프로필사진
            최OO 회원님
            </div>
            <div>
                <div className="flex"> <GiGymBag/> 헬스장 </div>
                <div className="flex"> <MdAttachEmail/> 이메일 </div>
                <div className="flex"> <FaMapLocationDot/> 주소 </div>
            </div>
        </div>
    );
};

export default ChatUserInfo;