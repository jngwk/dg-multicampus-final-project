import React, { useRef, useState, useEffect } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai"; // Corrected import for AiOutlineUser
import Bprofile from "../../assets/blank_profile.png";
import useValidation from "../../hooks/useValidation";
import Button from "../shared/Button";
import ModalLayout from "./ModalLayout";
import { userInfo, uploadImage, getImage, updateImage } from "../../api/userInfoApi";

const UserInfo = ({ toggleModal, userData }) => {
  const [userImage, setUserImage] = useState(null);
  const fileInput = useRef(null);
  const [passwordType, setPasswordType] = useState({
    type: "password",
    visible: false,
  });
  const [newPassword, setNewPassword] = useState("");
  const { errors, validateInput } = useValidation();

  useEffect(() => {
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

    fetchUserImage();
  }, []);

  const handlePasswordType = () => {
    setPasswordType((prevState) => ({
      type: prevState.visible ? "password" : "text",
      visible: !prevState.visible,
    }));
  };

  const handleButtonClick = () => {
    fileInput.current.click();
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    validateInput("password", e.target.value);
  };

  const handleModify = async () => {
    toggleModal();
    console.log("수정 버튼 클릭: 정보 수정하기");

    // Example: Update password if newPassword is not empty
    if (newPassword) {
      // Add your logic to update password using an API call
      console.log("New password:", newPassword);
    }
  };

  const onChangeImage = async () => {
    const file = fileInput.current.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("imageFiles", file);
  
      try {
        let response;
        if (userImage === null) {
          // If userImage doesn't exist (Bprofile is shown), upload a new image
          response = await uploadImage(formData);
        } else {
          // If userImage exists, update the existing image
          response = await updateImage(formData);
        }
  
        console.log("Image upload/update response:", response);
        setUserImage(URL.createObjectURL(file)); // Update user image state
      } catch (error) {
        console.error("Error uploading/updating image:", error);
      }
    }
  };

  return (
    <ModalLayout toggleModal={toggleModal}>
      <div className="userEdit">
        <div className="text-2xl font-extrabold pb-5">
          <p>내 정보</p>
        </div>
        <div className="userEdit-img flex justify-center items-center">
          <label className="profileImg-label relative" htmlFor="profileImg">
            <div className="w-28 h-28 rounded-full">
              <img
                className="w-full h-full rounded-full object-cover"
                src={userImage || Bprofile}
                alt="Profile"
              />
            </div>
            <input
              className="profileImg-input hidden"
              ref={fileInput}
              type="file"
              accept="image/*"
              onChange={onChangeImage}
            />
            <button
              className="cursor-pointer absolute bottom-2 right-0.5"
              onClick={handleButtonClick}
            >
              <AiOutlineUser size={27} />
            </button>
          </label>
        </div>
        {userData && (
          <div className="pt-3">
            <dl>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-10">
                <dt className="text-sm font-normal text-gray-500">이름</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userData.userName}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-10">
                <dt className="text-sm font-medium text-gray-500">비밀번호</dt>
                <dd className="flex text-gray-900 sm:mt-0 sm:col-span-2">
                  <input
                    id="hs-toggle-password"
                    className="w-full text-sm focus:outline-none border-b-2"
                    name="password"
                    type={passwordType.type}
                    value={newPassword}
                    onChange={handlePasswordChange}
                  />
                  <div>
                    <span onClick={handlePasswordType}>
                      {passwordType.visible ? <FaRegEye /> : <FaRegEyeSlash />}
                    </span>
                  </div>
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-10">
                <dt className="text-sm font-medium text-gray-500">E-mail</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userData.email}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-10">
                <dt className="text-sm font-medium text-gray-500">주소</dt>
                <dd className="flex justify-between mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p className="max-w-[190px] overflow-hidden text-ellipsis whitespace-nowrap">
                    {userData.address} {userData.detailAddress}
                  </p>
                  <button>
                    <IoSearchOutline className="size-4 sm:mt-0.5 float-right" />
                  </button>
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-10">
                <dt className="text-sm font-medium text-gray-500">
                  등록된 헬스장
                </dt>
                <dd className="flex justify-between mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userData.gym ? (
                    <p className="max-w-[190px] overflow-hidden text-ellipsis whitespace-nowrap">
                      {userData.gym} (만료일: {userData.gymExpiry})
                    </p>
                  ) : (
                    <p className="max-w-[190px] overflow-hidden text-ellipsis whitespace-nowrap text-gray-500 cursor-pointer hover:underline hover:underline-offset-4">
                      헬스장을 등록해주세요!
                    </p>
                  )}
                  <BiCommentDetail className="mt-0.5 size-4 float-right" />
                </dd>
              </div>
            </dl>
          </div>
        )}
        {(newPassword || userImage !== null) && (
          <div className="pt-6 flex float-end">
            <div className="mr-2">
              <Button
                height="40px"
                width="100px"
                color="peach-fuzz"
                label="수정"
                onClick={handleModify}
              />
            </div>
          </div>
        )}
      </div>
    </ModalLayout>
  );
};

export default UserInfo;
