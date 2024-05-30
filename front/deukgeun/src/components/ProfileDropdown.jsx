import React from "react";

const ProfileDropdown = ({ type }) => {
  // user type 별로 badge 내용을 다르게 표시
  const userEmail = sessionStorage.getItem("user").replace(/"/g, "");

  return (
    <div className="absolute border border-gray-400 w-64 h-fit right-2 top-20 rounded-lg p-3 bg-white shadow-sm">
      <div className="border-b-[0.5px] border-gray-400 p-2">
        <span className="block">이름</span>
        <span className="block text-gray-600">{userEmail}</span>
      </div>
      <div>
        <ul className="*:p-2 *:hover:opacity-70 *:hover:cursor-pointer *:hover:transition *:ease-in-out *:duration-100">
          <li>
            <img className="inline-block mr-1 peer" src="" alt="icon" />
            <span>내 정보</span>
          </li>
          <li>
            <img className="inline-block mr-1 peer" src="" alt="icon" />
            <span>내 정보</span>
          </li>
          <li>
            <img className="inline-block mr-1 peer" src="" alt="icon" />
            <span>내 정보</span>
          </li>
          <li>
            <img className="inline-block mr-1 peer" src="" alt="icon" />
            <span>내 정보</span>
          </li>
          <li>
            <img className="inline-block mr-1 peer" src="" alt="icon" />
            <span>내 정보</span>
          </li>
          <li>
            <img className="inline-block mr-1 peer" src="" alt="icon" />
            <span>내 정보</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;
