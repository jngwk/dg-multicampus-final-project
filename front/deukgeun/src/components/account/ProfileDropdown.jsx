import React, { useEffect, useState } from "react";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { useAuth } from "../../context/AuthContext";
import { useModal } from "../../hooks/useModal";
import UserInfo from "../modals/UserInfo";
import Loader from "../shared/Loader";

const ProfileDropdown = () => {
  const { userData, setUserData, removeCookieAndLogOut, loading } = useAuth();
  const customNavigate = useCustomNavigate();
  const { isModalVisible, toggleModal } = useModal();

  const handleLogout = () => {
    removeCookieAndLogOut();
    customNavigate("/");
  };

  return (
    <div className="relative border border-gray-200 w-52 h-fit rounded-lg p-3 bg-white shadow-md z-40 transition-all">
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
            <box-icon name="id-card" color="#ffbe98" size="sm"></box-icon>
            <span className="ml-3">
              {userData.role === "ROLE_GENERAL" && "내 정보"}
              {userData.role === "ROLE_GYM" && "헬스장 정보"}
            </span>
          </li>
          {isModalVisible ? (
            <UserInfo
              toggleModal={toggleModal}
              userData={userData}
              setUserData={setUserData}
            />
          ) : (
            ""
          )}
          {userData.role === "ROLE_GENERAL" && (
            <li
              className="profile-dropdown-list"
              onClick={() => customNavigate("/calendar")}
            >
              <box-icon name="calendar" color="#ffbe98" size="sm"></box-icon>
              <span className="ml-3">운동일지</span>
            </li>
          )}
          {userData.role === "ROLE_GYM" && (
            <>
              <li
                className="profile-dropdown-list"
                onClick={() => customNavigate("/stats")}
              >
                <box-icon
                  name="line-chart"
                  color="#ffbe98"
                  size="sm"
                ></box-icon>
                <span className="ml-3">회원통계</span>
              </li>
              <li
                className="profile-dropdown-list"
                onClick={() => customNavigate("/trainer")}
              >
                <box-icon
                  name="user-account"
                  type="solid"
                  color="#ffbe98"
                  size="sm"
                ></box-icon>
                <span className="ml-3">트레이너 관리</span>
              </li>
            </>
          )}
          <li
            className="profile-dropdown-list"
            onClick={() => customNavigate("/chat")}
          >
            <box-icon name="conversation" color="#ffbe98" size="sm"></box-icon>
            <span className="ml-3">대화방</span>
          </li>
          <li className="profile-dropdown-list">
            <box-icon name="question-mark" color="#ffbe98" size="sm"></box-icon>
            <span className="ml-3">문의내역</span>
          </li>
          <li className="profile-dropdown-list" onClick={handleLogout}>
            <box-icon name="log-out" color="#ffbe98" size="sm"></box-icon>
            <span className="ml-3">로그아웃</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileDropdown;
