import React, { useRef, useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { LiaUserEditSolid } from "react-icons/lia";
import Bprofile from "../../assets/blank_profile.png";
import useValidation from "../../hooks/useValidation";
import Button from "../shared/Button";
import ModalLayout from "./ModalLayout";

const MyInfo = ({ toggleModal, userData }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const fileInput = useRef(null);
  const [passwordType, setPasswordType] = useState({
    type: "password",
    visible: false,
  });
  const [newPassword, setNewPassword] = useState("");
  const { errors, validateInput } = useValidation();

  // Fetch user info when component mounts

  // password type 변경하는 함수
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

  // TODO 수정하기
  const handleModify = () => {
    toggleModal();
    console.log("수정 버튼 클릭: 정보 수정하기");
  };

  const onChangeImage = () => {
    const reader = new FileReader();
    const file = fileInput.current.files[0];

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImageUrl(reader.result);
    };
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
                src={imageUrl ? imageUrl : Bprofile}
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
              <LiaUserEditSolid size={27} />
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
              {/* TODO 비밀번호 유효성 검사 */}
              {/* {errors.password}를 표시해야함 (나머지는 다 구현됨) */}
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
        {newPassword && (
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

export default MyInfo;
