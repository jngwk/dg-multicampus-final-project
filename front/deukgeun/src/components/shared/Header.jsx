import logo from "../../assets/dg_logo.png";
import LoginModal from "../modals/LoginModal";
import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "../account/ProfileDropdown";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

console.log(logo);
export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const { isModalVisible, toggleModal } = useModal();
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState(false);
  const badge = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsProfileDropdownVisible(false);
  }, [location]);

  useEffect(() => {
    const closeWhenClickedOutside = (e) => {
      if (!badge.current?.contains(e.target)) {
        setIsProfileDropdownVisible(false);
      }
    };

    document.body.addEventListener("click", closeWhenClickedOutside);

    return () => {
      document.body.removeEventListener("click", closeWhenClickedOutside);
    };
  }, []);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownVisible(!isProfileDropdownVisible);
    // console.log(isProfileDropdownVisible);
  };

  return (
    // 헤더 중앙 정렬
    <div className="flex justify-center items-center">
      <div className="flex justify-between items-center w-5/6 px-5 border-b-2 border-black">
        <img
          onClick={() => navigate("/")}
          className="w-24 hover:cursor-pointer"
          src={logo}
          alt="logo"
        />
        <div className="flex gap-4 relative">
          <button onClick={() => navigate("/contact")}>문의하기</button>
          {user ? (
            <>
              <button ref={badge} onClick={toggleProfileDropdown}>
                프로필 뱃지
              </button>

              {/* User type 지정해서 안에 메뉴 변경 */}
              {isProfileDropdownVisible ? (
                <div className="absolute right-0 top-0">
                  <ProfileDropdown type="user" />
                </div>
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
      </div>
    </div>
  );
}
