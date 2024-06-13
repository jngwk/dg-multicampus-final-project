import React, { useEffect, useState } from "react";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../hooks/useModal";
import UserInfo from "../modals/UserInfo";
import Loader from "../shared/Loader";

const ProfileDropdown = ({ type }) => {
  const { userData, logout, loading } = useAuth();
  const customNavigate = useCustomNavigate();
  const { isModalVisible, toggleModal } = useModal();

  const handleLogout = () => {
    logout();
    customNavigate("/");
  };

  return (
    <div className="relative border border-gray-400 w-64 h-fit rounded-lg p-3 bg-white shadow-sm z-40">
      <div className="border-b-[0.5px] border-gray-400 p-2">
        {/* 사용자 이름 표시 */}
        {loading ? (
          <Loader />
        ) : (
          <>
            <span className="block">{userData.userName}</span>
            <span className="block text-gray-600">{userData.email}</span>
          </>
        )}
      </div>
      <div>
        <ul className="mt-4">
          <li className="profile-dropdown-list" onClick={toggleModal}>
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <span>내 정보</span>
          </li>
          {isModalVisible ? (
            <UserInfo toggleModal={toggleModal} userData={userData} />
          ) : (
            ""
          )}
          <li
            className="profile-dropdown-list"
            onClick={() => customNavigate("/Calendar")}
          >
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <span>운동일지</span>
          </li>
          <li
            className="profile-dropdown-list"
            onClick={() => customNavigate("/Chat")}
          >
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <span>대화방</span>
          </li>
          <li className="profile-dropdown-list">
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <span>문의내역</span>
          </li>
          <li className="profile-dropdown-list" onClick={handleLogout}>
            <img className="inline-block peer w-7 mx-3" src="" alt="icon" />
            <span>로그아웃</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;
