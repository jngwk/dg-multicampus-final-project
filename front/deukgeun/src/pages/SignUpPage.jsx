import React, { useState } from "react";
import Layout from "../components/shared/Layout";
import { useLocation } from "react-router-dom";
import Button from "../components/shared/Button";
import Input from "../components/shared/Input";
import { signUpGeneral, signUpGym } from "../api/signUpApi";
import AlertModal from "../components/modals/AlertModal";
import useValidation from "../hooks/useValidation";

const initState = {
  userName: "",
  email: "",
  password: "",
  address: "",
  detailAddress: "",
};

const SignUpPage = () => {
  const location = useLocation();
  const initialRole = location.state.role || "general";
  const [role, setRole] = useState(initialRole);
  const [userData, setUserData] = useState(initState);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });

    validateInput(name, value);
  };

  const { errors, validateConfirmPassword, validateForm, validateInput } =
    useValidation();

  const handleConfirmPassword = (e) => {
    // 비밀번호 유효성 검사
    setConfirmPassword(e.target.value);
    validateInput("confirmPassword", e.target.value, userData.password);
  };

  const handleSubmit = async () => {
    if (!validateForm(userData, confirmPassword)) {
      console.log("Validation failed", errors);
      return;
    }

    try {
      console.log("User data: ", userData);
      const result =
        role === "general"
          ? await signUpGeneral(userData)
          : await signUpGym(userData);
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
      setUserData(initState);
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
        <div className="flex gap-1">
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
            label="이름"
            width="340px"
            name="userName"
            value={userData.userName}
            onChange={handleChange}
            required={true}
            error={errors.userName}
          />
          <Input
            label="이메일"
            width="340px"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required={true}
            error={errors.email}
          />
          <Input
            label="비밀번호"
            type="password"
            width="340px"
            name="password"
            value={userData.password}
            onChange={handleChange}
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
          <Input
            label="주소"
            width="340px"
            name="address"
            value={userData.address}
            onChange={handleChange}
            error={errors.address}
          />
          <Input
            label="세부주소"
            width="340px"
            name="detailAddress"
            value={userData.detailAddress}
            onChange={handleChange}
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
