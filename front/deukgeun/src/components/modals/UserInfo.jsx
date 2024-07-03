import React, { useEffect, useRef, useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai"; // Corrected import for AiOutlineUser
import Bprofile from "../../assets/blank_profile.png";
import useValidation from "../../hooks/useValidation";
import Button from "../shared/Button";
import ModalLayout from "./ModalLayout";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import AddressModal from "./AddressModal";
import { useAuth } from "../../context/AuthContext";
import {
  userInfo,
  uploadImage,
  getImage,
  updateImage,
  updateUserInfo,
} from "../../api/userInfoApi";
import AlertModal from "./AlertModal";
import { findMembership } from "../../api/membershipApi";
import { GymInfoByUserId } from "../../api/gymApi"; 

const MyInfo = ({ toggleModal, userData, setUserData }) => {
  const initFullAddress = {
    address: userData.address || "",
    detailAddress: userData.detailAddress || "",
  };
  const [userImage, setUserImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const fileInput = useRef(null);
  const [passwordType, setPasswordType] = useState({
    type: "password",
    visible: false,
  });
  const [newPassword, setNewPassword] = useState("");
  const { errors, validateInput } = useValidation();
  const [fullAddress, setFullAddress] = useState(initFullAddress);
  const [isModified, setIsModified] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [membership, setMembership] = useState("");
  const customNavigate = useCustomNavigate();
  const { fetchUserData } = useAuth();
  const [gymInfo, setGymInfo] = useState(null);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const images = await getImage();
        console.log(images);
        if (images) {
          setUserImage(images.userImage);
        }
      } catch (error) {
        console.error("Error fetching user image:", error);
      }
    };

    fetchUserImage();
  }, []);

  useEffect(() => {
    setIsModified(false);
    setNewPassword("");
    setFullAddress(initFullAddress);

    const getRegisteredGym = async () => {
      try {
        if (userData.role !== "ROLE_GENERAL") return;
        const data = await findMembership();
        console.log("user modal findMembership", data);
        setMembership(data);
      } catch (error) {
        console.error("Error in userInfo modal finding membership", error);
        throw error;
      }
    };
    getRegisteredGym();
  }, []);

  useEffect(() => {
    checkIfModified();
  }, [newPassword, fullAddress]);

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

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFullAddress({
      ...fullAddress,
      [name]: value,
    });
  };

  const checkIfModified = () => {
    if (
      !errors.password &&
      (newPassword !== "" ||
        fullAddress.address !== userData.address ||
        fullAddress.detailAddress !== userData.detailAddress)
    ) {
      setIsModified(true);
    } else {
      setIsModified(false);
    }
  };

  const handleModify = async () => {
    if (errors.password) return;
    try {
      const data = { ...fullAddress, password: newPassword };
      const res = await updateUserInfo(data);
      setUserData({
        address: fullAddress.address,
        detailAddress: fullAddress.detailAddress,
        ...userData,
      });
      setIsAlertModalVisible(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmClick = async () => {
    setIsAlertModalVisible(false);
    await fetchUserData();
  };

  const onChangeImage = async () => {
    const file = fileInput.current.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("imageFiles", file);
      console.log(formData);
      try {
        let response;
        if (userImage === null) {
          response = await uploadImage(formData);
        } else {
          response = await updateImage(formData);
        }

        console.log("Image upload/update response:", response);
        setUserImage(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error uploading/updating image:", error);
      }
    }
  };

  const handleGymDetails = async () => {
    try {
      const gymData = await GymInfoByUserId(userData.userId); // userId를 사용하여 체육관 정보를 가져옵니다
      setGymInfo(gymData);
      // 체육관 정보를 사용하여 새 페이지로 이동합니다
      customNavigate(`/GymInfo`); // 라우팅 설정에 따라 URL 구조를 조정해야 합니다
    } catch (error) {
      console.error("체육관 정보를 불러오는 중 오류 발생:", error);
    }
  };
  return (
    <ModalLayout toggleModal={toggleModal}>
      <div className="userEdit w-[90%]">
        <div className="flex justify-between items-end px-2">
          <div className="text-2xl font-extrabold pb-5">
            <p>내 정보</p>
          </div>
          <div
            className="text-sm pb-5 cursor-pointer hover:underline hover:underline-offset-4"
            onClick={handleGymDetails} // Click handler for 상세정보
          >
            {(userData.role === "ROLE_GYM" ||
              userData.role === "ROLE_TRAINER") && <p>상세정보</p>}
          </div>
        </div>
        <div className="userEdit-img flex justify-center items-center">
          <label className="profileImg-label relative" htmlFor="profileImg">
            <div className="w-28 h-28 rounded-full">
              <img
                className="w-full h-full rounded-full object-cover"
                src={`${process.env.PUBLIC_URL}/images/${userImage}` || Bprofile}
                alt="Profile"
              />
            </div>
            <input
              className="profileImg-input hidden"
              ref={fileInput}
              type="file"
              accept=""
              onChange={onChangeImage}
            />
            <button className="cursor-pointer w-full text-center">
              <span
                className="text-xs underline underline-offset-4 text-gray-500 hover:text-gray-700"
                onClick={handleButtonClick}
              >
                프로필 사진 변경
              </span>
            </button>
          </label>
        </div>

        {userData && (
          <div className="mt-6">
            <dl>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-5">
                <dt className="text-sm font-normal text-gray-500">이름</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userData.userName}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-5">
                <dt className="text-sm font-medium text-gray-500">비밀번호</dt>
                <dd className="flex text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="w-full">
                    <input
                      id="hs-toggle-password"
                      className={`w-full text-sm focus:outline-none border-b-2 ${
                        errors.password && "border-red-500 !border-b"
                      }`}
                      name="password"
                      type={passwordType.type}
                      value={newPassword}
                      onChange={handlePasswordChange}
                    />
                    {errors.password && (
                      <p className="text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>
                  <div>
                    <span
                      onClick={handlePasswordType}
                      className="cursor-pointer"
                    >
                      {passwordType.visible ? <FaRegEye /> : <FaRegEyeSlash />}
                    </span>
                  </div>
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-5">
                <dt className="text-sm font-medium text-gray-500">E-mail</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {userData.email}
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-5">
                <dt className="text-sm font-medium text-gray-500">주소</dt>
                <dd className="flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <input
                    id="address"
                    className="w-full text-sm focus:outline-none border-b-2"
                    name="address"
                    type={"text"}
                    value={fullAddress.address || ""}
                    onChange={handleAddressChange}
                    readOnly
                  />
                  <div>
                    <button>
                      <IoSearchOutline
                        className="size-4 sm:mt-0.5 float-right"
                        onClick={() => setIsAddressModalVisible(true)}
                      />
                    </button>
                  </div>
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-5">
                <dt className="text-sm font-medium text-gray-500">상세 주소</dt>
                <dd className="flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <input
                    id="detailAddress"
                    className="w-full text-sm focus:outline-none border-b-2"
                    name="detailAddress"
                    type={"text"}
                    value={fullAddress.detailAddress || ""}
                    onChange={handleAddressChange}
                  />
                </dd>
              </div>
              <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-5">
                {userData.role === "ROLE_GENERAL" && (
                  <>
                    <dt className="text-sm font-medium text-gray-500">
                      회원권
                    </dt>
                    <dd className="flex justify-between mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {membership ? (
                        <>
                          <p className="max-w-[190px] overflow-hidden text-wrap whitespace-nowrap">
                            <span
                              className="cursor-pointer hover:text-gray-700"
                              onClick={() =>
                                customNavigate("/gymSearch", {
                                  state: {
                                    searchWord: membership.gym.user.userName,
                                  },
                                })
                              }
                            >
                              {membership.gym.user.userName}{" "}
                            </span>
                            <br />
                            <span
                              className="cursor-pointer hover:text-gray-700"
                              onClick={() =>
                                // TODO 회원권 연장으로 이동
                                customNavigate("/gymSearch", {
                                  state: {
                                    searchWord: membership.gym.user.userName,
                                  },
                                })
                              }
                            >
                              (만료일: {membership.expDate})
                            </span>
                          </p>
                        </>
                      ) : (
                        <p
                          className="max-w-[190px] overflow-hidden text-ellipsis whitespace-nowrap text-gray-500 cursor-pointer underline underline-offset-2 hover:text-gray-700"
                          onClick={() => customNavigate("/gymSearch")}
                        >
                          헬스장을 등록해주세요!
                        </p>
                      )}
                    </dd>
                  </>
                )}
              </div>
            </dl>
          </div>
        )}
        {(newPassword || userImage !== null) && (
          <div className="flex float-end">
            <div className="mr-2">
              <Button
                width="120px"
                color="peach-fuzz"
                label="수정"
                onClick={handleModify}
              />
            </div>
          </div>
        )}
      </div>
      {isAddressModalVisible && (
        <AddressModal
          userData={fullAddress}
          setUserData={setFullAddress}
          toggleModal={() => setIsAddressModalVisible(false)}
        />
      )}
      {isAlertModalVisible && (
        <AlertModal
          headerEmoji={"✔️"}
          line1={"회원정보가 수정됐어요!"}
          button2={{
            label: "확인",
            onClick: handleConfirmClick,
          }}
        />
      )}
    </ModalLayout>
  );
};

export default MyInfo;
