import logo from "../../assets/dg_logo.png";
import LoginModal from "../modals/LoginModal";
import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "../account/ProfileDropdown";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Fallback from "./Fallback";

// console.log(logo);
export default function Header() {
  const { userData, loading } = useAuth();
  const location = useLocation();
  const { isModalVisible, toggleModal } = useModal();
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState(false);
  const badge = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsProfileDropdownVisible(false);
  }, [location]);

  useEffect(() => {
    const closeWhenClickedOutside = (e) => {
      if (
        !dropdown.current?.contains(e.target) &&
        !badge.current?.contains(e.target)
      ) {
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

  if (loading) {
    return <Fallback />;
  }

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
          <button onClick={() => navigate("/qna")}>문의하기</button>
          {sessionStorage.getItem("isLoggedIn") ? (
            <>
              <button ref={badge} onClick={toggleProfileDropdown}>
                프로필 뱃지
              </button>

              {/* User type 지정해서 안에 메뉴 변경 */}
              <div ref={dropdown} className="absolute right-0 top-10">
                {isProfileDropdownVisible ? (
                  <ProfileDropdown type="user" userData={userData} />
                ) : (
                  ""
                )}
              </div>
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
