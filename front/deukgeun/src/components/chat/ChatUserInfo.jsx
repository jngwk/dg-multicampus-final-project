import React, { useState } from 'react';
import { TbLayoutSidebarLeftCollapseFilled } from "react-icons/tb";
import {GiGymBag} from "react-icons/gi";
import { MdAttachEmail } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";




const ChatUserInfo = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
        {!isOpen?
            (
                <button className="ml-auto m-1" onClick={() => setIsOpen(!isOpen)}>
                  <TbLayoutSidebarLeftCollapseFilled size="25" color="#4E4C4F"/>
                </button>
            ) :
            (
                <button className='absolute text-xl text-#4E4C4F top-2 right-4 z-10'
                    onClick={() => setIsOpen(!isOpen)}>
                    x
                </button>
            )
        }
        <div className={`fixed right-36 top-[182px] w-1/5 h-[35rem] mx-1 border-2 rounded-lg border-grayish-red 
                ${isOpen ?'translate-x-0':'translate-x-full'} ease-in-out duration-300`}>
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
        </>
    );
};

export default ChatUserInfo;