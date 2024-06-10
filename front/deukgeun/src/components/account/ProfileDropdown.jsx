import React from "react";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../hooks/useModal";
import MyInfo from "../modals/MyInfo";

const ProfileDropdown = ({ type }) => {
  // user type 별로 badge 내용을 다르게 표시
  const userEmail = sessionStorage.getItem("user").replace(/"/g, "");
  const customNavigate = useCustomNavigate();
  const { removeUserFromSession } = useAuth();
  const { isModalVisible, toggleModal } = useModal();

  return (
    <div className="absolute border border-gray-400 w-64 h-fit right-5 top-20 rounded-lg p-3 bg-white shadow-sm z-40">
      <div className="border-b-[0.5px] border-gray-400 p-2">
        {/* 받아온 이름 넣기 */}
        <span className="block">이름</span>
        <span className="block text-gray-600">{userEmail}</span>
      </div>
      <div>
        <ul className="mt-4">
          <li className="profile-dropdown-list">
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <button onClick={toggleModal}>내 정보</button>
          </li>
          {isModalVisible ? <MyInfo toggleModal={toggleModal} /> : ""}
          <li
            className="profile-dropdown-list"
            onClick={() => customNavigate("/calender")}
          >
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <span>운동일지</span>
          </li>
          <li className="profile-dropdown-list"
              onClick={() => customNavigate("/chat")}
              >
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <span>대화방</span>
          </li>
          <li className="profile-dropdown-list">
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <span>문의내역</span>
          </li>
          <li className="profile-dropdown-list" onClick={removeUserFromSession}>
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <span>로그아웃</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;