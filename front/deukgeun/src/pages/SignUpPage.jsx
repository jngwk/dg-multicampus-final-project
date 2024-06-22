import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Button from "../components/shared/Button";
import Input from "../components/shared/Input";
import {
  signUpGeneral,
  signUpGym,
  sendVerificationEmail,
  checkCrNumber,
} from "../api/signUpApi";
import AlertModal from "../components/modals/AlertModal";
import useValidation from "../hooks/useValidation";
import AddressModal from "../components/modals/AddressModal";

// 회원 정보
const initUserData = {
  userName: "",
  email: "",
  password: "",
  address: "",
  detailAddress: "",
};

// 헬스장 정보
const initGymData = {
  gymName: "",
  crNumber: "",
  phoneNumber: "",
};

// 이메일 인증 관련
const initCodeData = {
  code: "",
  inputCode: "",
  sent: false,
  verified: "",
};

/* TODO useValidation CR number 중복 검사 주석처리 해제하기 */
const SignUpPage = () => {
  const location = useLocation();
  const initRole = location.state.role || "general";
  const [role, setRole] = useState(initRole);
  const [userData, setUserData] = useState(initUserData);
  const [gymData, setGymData] = useState(initGymData);
  const [codeData, setCodeData] = useState(initCodeData);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCrNumberValid, setIsCrNumberValid] = useState(null);

  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

  const [error, setError] = useState("");
  const { errors, resetErrors, validateForm, validateInput } = useValidation();

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });

    validateInput(name, value);
  };

  const handleGymDataChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);
    setGymData({
      ...gymData,
      [name]: value,
    });
    validateInput(name, value);
  };

  const handleEmailChange = (e) => {
    setUserData({ ...userData, email: e.target.value });
    validateInput("email", e.target.value);
    console.log(errors.email);
    (codeData.verified || codeData.sent) && setCodeData(initCodeData);
    // console.log("codeData", codeData);
  };

  const handleCrNumberChange = (e) => {
    setGymData({
      ...gymData,
      crNumber: e.target.value,
    });
    setIsCrNumberValid(null);
    validateInput("crNumber", e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    // 비밀번호 유효성 검사
    setConfirmPassword(e.target.value);
    validateInput("confirmPassword", e.target.value, userData.password);
  };

  const handleInputCodeChange = (e) => {
    if (e.target.value === "") {
      setCodeData({ ...codeData, inputCode: e.target.value });
    } else if (e.target.value === codeData.code) {
      setCodeData({ ...codeData, inputCode: e.target.value, verified: true });
    } else {
      setCodeData({ ...codeData, inputCode: e.target.value, verified: false });
    }
    // console.log(codeData);
  };

  const handleSubmit = async () => {
    const data = role === "general" ? userData : { ...userData, ...gymData };

    if (!validateForm(data, confirmPassword, codeData.verified)) {
      console.log("Validation failed");
      // console.log(codeData.verified);
      return;
    }

    if (role === "gym") {
      if (!isCrNumberValid) {
        return;
      }
    }

    try {
      console.log("User data: ", data);
      const result =
        role === "general" ? await signUpGeneral(data) : await signUpGym(data);
      console.log("Sign up result: ", result);
      // 회원가입 완료 모달 토글
      setIsAlertModalVisible(true);
    } catch (error) {
      setError("회원가입 도중 오류가 발생했습니다.");
      console.log("Sign up error: ", error);
    }
  };

  const toggleRole = (e) => {
    const { name } = e.target;
    console.log(name);
    if (name !== role) {
      setRole(name);
      resetForm();
    }
  };

  const getButtonFontWeight = (buttonRole) => {
    return role === buttonRole ? "font-bold" : "font-normal";
  };

  const getButtonColor = (buttonRole) => {
    return role === buttonRole ? "peach-fuzz" : "gray";
  };

  const sendCode = async () => {
    if (!userData.email || errors.email || codeData.sent || codeData.verified) {
      console.log("버튼 비활성화 상태");
      return;
    }
    try {
      const generatedCode = generateVerificationCode();
      console.log("RequestBody", userData.email, codeData.code);
      const response = sendVerificationEmail(userData.email, generatedCode);
      setCodeData({ ...codeData, sent: true, code: generatedCode });
      // console.log("codeData: ", codeData);
      // console.log("response: ", response);
    } catch (error) {
      setError("이메일 전송 오류");
      // console.log("Error while sending email: ", error);
      setCodeData({ ...codeData, sent: false });
    }
  };

  const generateVerificationCode = () => {
    const generatedCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    return generatedCode;
  };

  const verifyGym = async () => {
    // 2728702429 사용해서 테스트
    try {
      const response = await checkCrNumber(gymData.crNumber);
      console.log(response);
      response.data.result
        ? setIsCrNumberValid(true)
        : setIsCrNumberValid(false);
    } catch (error) {
      setError("사업자등록번호 조회 실패");
      console.log(error);
    }
  };

  const resetForm = () => {
    setUserData(initUserData);
    setGymData(initGymData);
    setCodeData(initCodeData);
    setConfirmPassword("");
    setIsCrNumberValid(null);
    resetErrors();
  };

  return (
    <>
      {/* sm:translate-y-[20%] mt-3*/}
      <div className="w-fit h-fit mx-auto sm:mt-0">
        <span className="block text-center text-6xl my-10 hover:animate-wave cursor-grab">
          👋
        </span>
        <div className="flex gap-[1px]">
          <Button
            label="일반"
            width="170px"
            height="52px"
            name="general"
            onClick={toggleRole}
            className={`${getButtonFontWeight("general")}`}
            color={`${getButtonColor("general")}`}
          />
          <Button
            label="헬스장"
            width="170px"
            height="52px"
            name="gym"
            onClick={toggleRole}
            className={`${getButtonFontWeight("gym")}`}
            color={`${getButtonColor("gym")}`}
          />
        </div>
        <div className="flex flex-col items-center justify-center">
          <Input
            label={role === "general" ? "이름" : "헬스장 이름 (지점명 포함)"}
            width="340px"
            name="userName"
            value={userData.userName}
            onChange={handleUserDataChange}
            required={true}
            error={errors.userName}
          />
          {role === "gym" && (
            <>
              <Input
                label="대표자명"
                width="340px"
                name="gymName"
                value={gymData.gymName}
                onChange={handleGymDataChange}
                required={true}
                error={errors.gymName}
              />
              <Input
                label="사업자등록 번호"
                width="340px"
                name="crNumber"
                value={gymData.crNumber}
                onChange={handleCrNumberChange}
                required={true}
                maxLength={"10"}
                error={
                  errors.crNumber ||
                  (isCrNumberValid === false && "등록된 정보가 없는 번호입니다")
                }
                message={isCrNumberValid && "확왼됐습니다"}
                feature="인증하기"
                featureOnClick={verifyGym}
              />
            </>
          )}
          <Input
            label="이메일"
            width="340px"
            name="email"
            value={userData.email}
            onChange={handleEmailChange}
            required={true}
            error={errors.email}
            feature="인증하기"
            featureOnClick={sendCode}
          />
          <div
            className={`${
              !codeData.sent
                ? "opacity-0 -translate-y-5 h-0"
                : "opacity-1 translate-y-0"
            } transition-all duration-700`}
          >
            <Input
              label="인증번호"
              width="340px"
              name="inputCode"
              value={codeData.inputCode}
              onChange={handleInputCodeChange}
              required={true}
              readOnly={codeData.verified}
              error={
                codeData.verified === false && "인증번호가 일치하지 않습니다."
              }
              message={codeData.verified && "인증이 완료 되었습니다."}
            />
          </div>
          <Input
            label="비밀번호"
            type="password"
            width="340px"
            name="password"
            value={userData.password}
            onChange={handleUserDataChange}
            required={true}
            error={errors.password}
          />
          <Input
            label="비밀번호 확인"
            type="password"
            width="340px"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required={true}
            error={errors.confirmPassword}
          />
          {role === "gym" && (
            <Input
              label="전화번호"
              type="phone"
              width="340px"
              name="phoneNumber"
              value={gymData.phoneNumber}
              onChange={handleGymDataChange}
              required={true}
              error={errors.phoneNumber}
            />
          )}
          <Input
            label="주소"
            width="340px"
            name="address"
            value={userData.address}
            onChange={handleUserDataChange}
            required={role === "gym" ? true : false}
            error={errors.address}
            readOnly={true}
            feature="검색"
            featureOnClick={() => setIsAddressModalVisible(true)}
            featureEnableOnLoad={true}
          />
          <Input
            label="세부주소"
            width="340px"
            name="detailAddress"
            value={userData.detailAddress}
            onChange={handleUserDataChange}
            required={role === "gym" ? true : false}
            error={errors.detailAddress}
          />
        </div>
        <Button
          label="회원가입"
          width="340px"
          height="52px"
          onClick={handleSubmit}
        />
      </div>
      {isAlertModalVisible && (
        <AlertModal
          headerEmoji={"🥳"}
          line1={"득근 회원이 되신걸 축하드려요!"}
          line2={"득근득근한 하루되세요"}
          // button1={{
          //   label: "로그인하기",
          //   path: "/",
          //   option: "{state:{isAlertModalVisible: true}}",
          // }}
          button2={{ label: "메인으로", path: "/" }}
        />
      )}
      {isAddressModalVisible && (
        <AddressModal
          userData={userData}
          setUserData={setUserData}
          toggleModal={() => setIsAddressModalVisible(false)}
        />
      )}
    </>
  );
};

export default SignUpPage;
