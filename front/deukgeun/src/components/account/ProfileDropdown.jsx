import React from "react";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../hooks/useModal";
import MyInfo from "../modals/MyInfo";

const ProfileDropdown = ({ type }) => {
  // user type 별로 badge 내용을 다르게 표시
  const userData = JSON.parse(sessionStorage.getItem("user"));
  const customNavigate = useCustomNavigate();
  const { removeUserFromSession } = useAuth();
  const { isModalVisible, toggleModal } = useModal();

  console.log("userData", userData);
  return (
    <div className="border border-gray-400 w-64 h-fit rounded-lg p-3 bg-white shadow-sm z-40">
      <div className="border-b-[0.5px] border-gray-400 p-2">
        {/* 받아온 이름 넣기 */}
        <span className="block">{userData.userName}</span>
        <span className="block text-gray-600">{userData.email}</span>
      </div>
      <div>
        <ul className="mt-4">
          <li className="profile-dropdown-list" onClick={toggleModal}>
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <span>내 정보</span>
          </li>
          {isModalVisible ? <MyInfo toggleModal={toggleModal} /> : ""}
          <li
            className="profile-dropdown-list"
            onClick={() => customNavigate("/calendar")}
          >
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <span>운동일지</span>
          </li>
          <li
            className="profile-dropdown-list"
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
