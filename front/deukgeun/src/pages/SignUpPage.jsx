import React, { useState } from "react";
import Layout from "../components/shared/Layout";
import { useLocation } from "react-router-dom";
import Button from "../components/shared/Button";
import Input from "../components/shared/Input";
import { signUpGeneral, signUpGym } from "../api/signUpApi";
import AlertModal from "../components/modals/AlertModal";
import useValidation from "../hooks/useValidation";

const initUserData = {
  userName: "",
  email: "",
  password: "",
  address: "",
  detailAddress: "",
};

const initGymData = {
  gymName: "",
  crNumber: "",
  phoneNumber: "",
};

const SignUpPage = () => {
  const location = useLocation();
  const initRole = location.state.role || "general";
  const [role, setRole] = useState(initRole);
  const [userData, setUserData] = useState(initUserData);
  const [gymData, setGymData] = useState(initGymData);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    setGymData({
      ...gymData,
      [name]: value,
    });
    validateInput(name, value);
  };

  const { errors, resetErrors, validateForm, validateInput } = useValidation();

  const handleConfirmPassword = (e) => {
    // 비밀번호 유효성 검사
    setConfirmPassword(e.target.value);
    validateInput("confirmPassword", e.target.value, userData.password);
  };

  const handleSubmit = async () => {
    const data = role === "general" ? userData : { ...userData, ...gymData };
    if (!validateForm(data, confirmPassword)) {
      console.log("Validation failed", errors);
      return;
    }

    try {
      console.log("User data: ", data);
      const result =
        role === "general" ? await signUpGeneral(data) : await signUpGym(data);
      console.log("Sign up result: ", result);
      // 회원가입 완료 모달 토글
      setIsModalVisible(true);
    } catch (error) {
      setError("회원가입 도중 오류가 발생했습니다.");
      console.log("Sign up error: ", error);
    }
  };

  const toggleRole = (e) => {
    const { name } = e.target;
    console.log(name);
    if (name !== role) {
      setUserData(initUserData);
      setGymData(initGymData);
      resetErrors();
      setRole(name);
    }
  };

  const getButtonFontWeight = (buttonRole) => {
    return role === buttonRole ? "font-bold" : "font-normal";
  };

  const getButtonColor = (buttonRole) => {
    return role === buttonRole ? "peach-fuzz" : "gray";
  };

  return (
    <Layout>
      <div className="mx-auto w-fit mt-6">
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
            label={role === "general" ? "이름" : "사업자명"}
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
                label="헬스장 이름"
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
                onChange={handleGymDataChange}
                required={true}
                error={errors.crNumber}
              />
            </>
          )}
          <Input
            label="이메일"
            width="340px"
            name="email"
            value={userData.email}
            onChange={handleUserDataChange}
            required={true}
            error={errors.email}
          />
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
            onChange={handleConfirmPassword}
            required={true}
            error={errors.confirmPassword}
          />
          {role === "gym" && (
            <Input
              label="전화번호"
              type="phone"
              width="340px"
              name="crNumber"
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
      {isModalVisible && (
        <AlertModal
          headerEmoji={"🥳"}
          line1={"득근 회원이 되신걸 축하드려요!"}
          line2={"득근득근한 하루되세요"}
          // button1={{
          //   label: "로그인하기",
          //   path: "/",
          //   option: "{state:{isModalVisible: true}}",
          // }}
          button2={{ label: "메인으로", path: "/" }}
        />
      )}
    </Layout>
  );
};

export default SignUpPage;
