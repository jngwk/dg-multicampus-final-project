import logo from "../../assets/dg_logo.png";
import LoginModal from "../modals/LoginModal";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "../account/ProfileDropdown";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Fallback from "./Fallback";
import { useLoginModalContext } from "../../context/LoginModalContext";

// console.log(logo);
export default function Header() {
  const { userData, loading } = useAuth();
  const location = useLocation();
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState(false);
  const badge = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate();
  const { toggleLoginModal } = useLoginModalContext();

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
    <div className="relative h-[10dvh] flex justify-center items-center">
      <div className="flex justify-between items-center w-5/6 px-5 border-b-2 border-black">
        <img
          onClick={() => navigate("/")}
          className="w-24 hover:cursor-pointer"
          src={logo}
          alt="logo"
        />
        <div className="flex gap-4 relative">
          <button onClick={() => navigate("/gymSearch")}>헬스장 조회</button>
          <button onClick={() => navigate("/qna")}>문의하기</button>
          {sessionStorage.getItem("isLoggedIn") ? (
            <>
              <div className="cursor-pointer flex justify-center items-center">
                <box-icon
                  name="user-circle"
                  type="solid"
                  color="#687280"
                  size="md"
                  ref={badge}
                  onClick={toggleProfileDropdown}
                ></box-icon>
              </div>
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
              <button onClick={toggleLoginModal}>로그인</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
