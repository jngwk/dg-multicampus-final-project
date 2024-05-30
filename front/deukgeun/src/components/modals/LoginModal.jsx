import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import logo from "../../assets/dg_logo_small.png";
import Input from "../Input";
import Button from "../Button";
import { Link } from "react-router-dom";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { login } from "../../api/loginApi";
import { useAuth } from "../../context/AuthContext";

const LoginModal = ({ toggleModal }) => {
  const { moveToSignUp } = useCustomNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailValidationState, setEmailValidationState] = useState(null);
  const [passwordValidationState, setPasswordValidationState] = useState(null);
  const [error, setError] = useState("");
  const { addUserToSession } = useAuth();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailValidationState(null);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValidationState(null);
  };

  const validateInput = () => {
    let isInputValid = true;

    if (!email) {
      console.log("no-email");
      isInputValid = false;
      setEmailValidationState("invalid");
      // console.log("email validity", emailValidationState);
    }
    if (!password) {
      isInputValid = false;
      setPasswordValidationState("invalid");
      // console.log("password validity", passwordValidationState);
    }
    return isInputValid;
  };

  const handleLogin = async () => {
    console.log("login clicked");
    setError("");
    setEmailValidationState(null);
    setPasswordValidationState(null);
    if (!validateInput()) {
      console.log("Input validation failed");
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    addUserToSession(email);
    // try {
    //   const data = await login(email, password);
    //   // 로그인 성공시 context에 로그인 여부 넣기
    //   addUserToSession(email);
    //   console.log("로그인 성공", data);
    //   toggleModal(); // 로그인 성공시 팝업 닫음
    // } catch (error) {
    //   setError("로그인에 실패했습니다. 다시 시도하세요.");
    //   setEmailValidationState("invalid");
    //   setPasswordValidationState("invalid");
    // }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <ModalLayout toggleModal={toggleModal}>
      <img src={logo} alt="logo" width={120} className="mb-14" />
      <div className="flex flex-col gap-1 justify-center">
        <Input
          label="이메일"
          value={email}
          onChange={handleEmailChange}
          onKeyPress={handleKeyPress}
          validationState={emailValidationState}
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          onKeyPress={handleKeyPress}
          validationState={passwordValidationState}
        />
        {error && <div className="text-red-500 text-xs">{error}</div>}
        <Link
          to="find-password"
          className="text-right text-sm text-gray-500 hover:underline hover:underline-offset-4 hover:cursor-pointer hover:text-gray-600"
        >
          비밀번호를 잊으셨나요?
        </Link>
        <br />
        <Button onClick={handleLogin} color="peach-fuzz" label="로그인" />
        <Button onClick={moveToSignUp} color="bright-orange" label="회원가입" />
      </div>
    </ModalLayout>
  );
};

export default LoginModal;
