import React, { useState } from 'react';
import { TbLayoutSidebarLeftCollapseFilled,TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import {GiGymBag} from "react-icons/gi";
import { MdAttachEmail } from "react-icons/md";
import { FaMapLocationDot } from "react-icons/fa6";


//안쓰는 페이지

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
                <button className='absolute top-2 right-4 z-10'
                    onClick={() => setIsOpen(!isOpen)}>
                        <TbLayoutSidebarRightCollapseFilled size="25" color="#4E4C4F"/>
                </button>
            )
        }
            <div className={`w-2/5 h-[35rem] mr-1 border-2 rounded-lg border-grayish-red 
                ${isOpen ?'translate-x-0':'translate-x-full  opacity-0'} ease-in-out duration-300`}>
                    <div className='flex items-center'>
                      <img className=" w-10 h-10 rounded-full object-cover " src={profileImg} />
                      <span className="text-xs"> 최OO 회원님 </span>
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