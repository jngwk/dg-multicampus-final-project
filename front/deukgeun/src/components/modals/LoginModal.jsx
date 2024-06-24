import React, { useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";
import logo from "../../assets/dg_logo_small.png";
import Input from "../shared/Input";
import Button from "../shared/Button";
import { Link } from "react-router-dom";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { login } from "../../api/loginApi";
import { useAuth } from "../../context/AuthContext";
import Fallback from "../shared/Fallback";

const initErrors = { email: "", password: "", login: "" };

const LoginModal = ({ toggleModal }) => {
  const customNavigate = useCustomNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState(initErrors);
  const { fetchUserData, loading } = useAuth();

  useEffect(() => {
    // console.log("Updated Errors: ", errors);
  }, [errors]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setErrors((prevErrors) => {
      const { email: removedError, ...restErrors } = prevErrors;
      return restErrors;
    });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setErrors((prevErrors) => {
      const { password: removedError, ...restErrors } = prevErrors;
      return restErrors;
    });
  };

  const validateInput = () => {
    let isInputValid = true;
    const newErrors = { ...initErrors };

    if (!email) {
      isInputValid = false;
      newErrors.email = "이메일을 입력해주세요";
    }

    if (!password) {
      isInputValid = false;
      newErrors.password = "비밀번호를 입력해주세요";
    }

    setErrors(newErrors);
    return isInputValid;
  };

  const handleLogin = async () => {
    console.log("login clicked");

    if (!validateInput()) {
      console.log("Input validation failed");
      console.log(errors);
      return;
    }
    try {
      const accessToken = await login(email, password);

      if (accessToken) {
        sessionStorage.setItem("isLoggedIn", true);
        console.log(
          "로그인 성공",
          accessToken,
          sessionStorage.getItem("isLoggedIn")
        );
        toggleModal(); // 로그인 성공시 팝업 닫음
        customNavigate("/", { replace: true }); // 메인으로 이동
        fetchUserData(); // 유저 데이터 가져오기
        if (loading) {
          return <Fallback />;
        }
      } else {
        setErrors({ ...initErrors, login: "로그인 정보가 일치하지 않습니다." });
      }
    } catch (errors) {
      setErrors({ ...initErrors, login: "로그인에 실패했습니다." });
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  const handleSignUpClick = () => {
    toggleModal();
    customNavigate("/signUp");
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
          error={errors.email}
        />
        <Input
          label="비밀번호"
          type="password"
          value={password}
          onChange={handlePasswordChange}
          onKeyPress={handleKeyPress}
          error={errors.password}
        />
        {errors.login && (
          <div className="text-red-500 text-xs">{errors.login}</div>
        )}

        {/* find-password 모달띄우기 */}
        <Link
          to="find-password"
          className="text-right text-sm text-gray-500 hover:underline hover:underline-offset-4 hover:cursor-pointer hover:text-gray-600"
        >
          비밀번호를 잊으셨나요?
        </Link>

        <br />
        <Button onClick={handleLogin} color="peach-fuzz" label="로그인" />
        <Button
          onClick={handleSignUpClick}
          color="bright-orange"
          label="회원가입"
        />
      </div>
    </ModalLayout>
  );
};

export default LoginModal;
