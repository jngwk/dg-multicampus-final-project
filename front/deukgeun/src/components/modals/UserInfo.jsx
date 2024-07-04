import React, { useEffect, useRef, useState } from "react";
import { BiCommentDetail } from "react-icons/bi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { IoSearchOutline } from "react-icons/io5";
import { AiOutlineUser } from "react-icons/ai";
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
import MembershipPtSelectModal from "./MembershipPtSelectModal";
import MembershipModal from "./MembershipModal";

const MyInfo = ({ toggleModal, userData, setUserData }) => {
  const initFullAddress = {
    address: userData.address || "",
    detailAddress: userData.detailAddress || "",
  };
  const [userImage, setUserImage] = useState(null);
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
  // const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
  const [isMembershipModalVisible, setIsMembershipModalVisible] =
    useState(false);
  const [imagetUpdate, setImageUpdate] = useState(false);

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const imageData = await getImage();
        if (imageData && imageData.userImage) {
          setImageUpdate(true);
          setUserImage(`/images/${imageData.userImage}`);
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
  }, [newPassword, fullAddress, userImage]);

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
        fullAddress.detailAddress !== userData.detailAddress ||
        fileInput.current.formData)
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

      if (fileInput.current.formData) {
        let imageResponse;
        if (imagetUpdate === false) {
          imageResponse = await uploadImage(fileInput.current.formData);
        } else {
          imageResponse = await updateImage(fileInput.current.formData);
        }
        console.log("Image upload/update response:", imageResponse);

        if (imageResponse.data && imageResponse.data.userImage) {
          setUserImage(`/images/${imageResponse.data.userImage}`);
        }

        fileInput.current.formData = null;
      }

      setUserData({
        address: fullAddress.address,
        detailAddress: fullAddress.detailAddress,
        ...userData,
      });
      setIsAlertModalVisible(true);
      setIsModified(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmClick = async () => {
    setIsAlertModalVisible(false);
    await fetchUserData();
  };

  const onChangeImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const localImageUrl = URL.createObjectURL(file);
      setUserImage(localImageUrl);
      setIsModified(true);

      const formData = new FormData();
      formData.append("imageFile", file);
      fileInput.current.formData = formData;
    }
  };

  const handleGymDetails = async () => {
    try {
      const gymData = await GymInfoByUserId(userData.userId);
      setGymInfo(gymData);
      customNavigate(`/GymInfo`);
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
            onClick={handleGymDetails}
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
                              onClick={() => setIsMembershipModalVisible(true)}
                            >
                              {membership.gym.user.userName}{" "}
                            </span>
                          </p>
                          {isMembershipModalVisible && (
                            <MembershipModal
                              membership={membership}
                              toggleModal={() =>
                                setIsMembershipModalVisible(false)
                              }
                            />
                          )}
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
        {isModified && (
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
