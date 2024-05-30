import logo from "../../assets/dg_logo.png";
import LoginModal from "../modals/LoginModal";
import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "../ProfileDropdown";
import { useState } from "react";

console.log(logo);
export default function Header() {
  const { user } = useAuth();
  const { isModalVisible, toggleModal } = useModal();
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState(false);
  const toggleProfileDropdown = () => {
    setIsProfileDropdownVisible(!isProfileDropdownVisible);
    console.log(isProfileDropdownVisible);
  };

  return (
    <div className="flex justify-between items-center w-full px-5 border-b-2 border-black">
      <img className="w-24" src={logo} alt="logo" />
      {user ? (
        <>
          <button onClick={toggleProfileDropdown}>프로필 뱃지</button>
          {isProfileDropdownVisible ? (
            <ProfileDropdown type="user" /> // user type 지정해서 안에 메뉴 변경
          ) : (
            ""
          )}
        </>
      ) : (
        <>
          <button onClick={toggleModal}>로그인</button>
          {isModalVisible ? <LoginModal toggleModal={toggleModal} /> : ""}
        </>
      )}
    </div>
  );
}
