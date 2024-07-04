import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../../assets/dg_logo.png";
import { useAuth } from "../../context/AuthContext";
import ProfileDropdown from "../account/ProfileDropdown";
import Fallback from "./Fallback";
import Bprofile from "../../assets/blank_profile.png";
import { getImage } from "../../api/userInfoApi";
import { useLoginModalContext } from "../../context/LoginModalContext";

export default function Header() {
  const [userImage, setUserImage] = useState(null);
  const { userData, loading } = useAuth();
  const location = useLocation();
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState(false);
  const badge = useRef(null);
  const dropdown = useRef(null);
  const navigate = useNavigate();
  const { toggleLoginModal } = useLoginModalContext();

  const fetchUserImage = async () => {
    try {
      const images = await getImage();
      if (images) {
        setUserImage(images.userImage);
      }
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  };

  useEffect(() => {
    setIsProfileDropdownVisible(false);
  }, [location]);

  useEffect(() => {
    setUserImage();
    if (
      sessionStorage.getItem("isLoggedIn") &&
      userData?.userImage?.userImage
    ) {
      fetchUserImage();
    }
  }, [userData]);

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
  };

  if (loading) {
    return <Fallback />;
  }

  return (
    <div className="relative h-[14dvh] flex justify-center items-center">
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
              <div
                className="cursor-pointer flex justify-center items-center"
                ref={badge}
                onClick={toggleProfileDropdown}
              >
                {userData.userImage?.userImage ? (
                  <img
                    src={`/images/${userData.userImage.userImage}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <box-icon
                    name="user-circle"
                    type="solid"
                    size="md"
                    color="#9f8d8d"
                  ></box-icon>
                )}
              </div>
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
