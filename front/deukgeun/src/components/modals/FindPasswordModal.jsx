import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import { useModal } from "../../hooks/useModal";
import LoginModal from "./LoginModal";
import logo from "../../assets/dg_logo_small.png";
import Input from "../shared/Input";
import Button from "../shared/Button";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import {
  checkDuplicateEmail,
  sendVerificationEmail,
} from "../../api/signUpApi";
import { resetPasswordWithEmail } from "../../api/userInfoApi";
import AlertModal from "./AlertModal";

const initErrors = {
  name: "",
  email: "",
  password: "",
  passwordConfirm: "",
  findPassword: "",
  code: "",
};

const FindPasswordModal = ({ toggleModal }) => {
  const customNavigate = useCustomNavigate();
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [errors, setErrors] = useState(initErrors);
  const [verifyCodeSent, setVerifyCodeSent] = useState(false);
  const [sentCode, setSentCode] = useState();
  const [code, setCode] = useState();
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    if (verifyCodeSent) {
      setVerifyCodeSent(false);
      setSentCode("");
    }
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
    setErrors((prevErrors) => ({ ...prevErrors, code: "" }));
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
    validatePassword(e.target.value);
    if (newPasswordConfirm)
      validateConfirmPassword(e.target.value, newPasswordConfirm);
  };

  const handleNewPasswordConfirmChange = (e) => {
    setNewPasswordConfirm(e.target.value);
    validateConfirmPassword(newPassword, e.target.value);
  };

  const validatePassword = (password) => {
    // console.log("Validating password: ", password); // Debugging
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
        password
      )
    ) {
      setErrors((prev) => ({
        ...prev,
        password: "최소 8자, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }
  };
  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        passwordConfirm: "비밀번호가 일치하지 않습니다",
      }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, passwordConfirm: "" }));
    }
  };
  const validateFindPasswordInput = async () => {
    let isValid = true;
    let isValidEmail = true;
    const newErrors = { ...initErrors };

    // 이메일 확인

    try {
      const res = await checkDuplicateEmail(email);
      console.log("email 확인", res);
      isValidEmail = res;
    } catch (error) {
      console.log("error checking duplicate email", error);
      newErrors.email = "데이터베이스 오류";
    }

    // if (!name) {
    //   isValid = false;
    //   newErrors.name = "이름을 입력해주세요";
    // } else if (!isValidName) {
    //   isValid = false;
    //   newErrors.name = "이름을 다시 입력해주세요.";
    // }

    if (!email) {
      isValid = false;
      newErrors.email = "이메일을 입력해주세요";
    } else if (!isValidEmail) {
      isValid = false;
      newErrors.email = "일치하는 정보가 없습니다.";
    }

    console.log(isValid);

    setErrors(newErrors);
    return isValid;
  };

  const validateResetPasswordInput = () => {
    let isValid = true;
    // const newErrors = { ...initErrors };

    if (!newPassword) {
      isValid = false;
      setErrors((prev) => ({
        ...prev,
        password: "새 비밀번호를 입력해주세요",
      }));
    }

    if (errors.password || errors.passwordConfirm) {
      isValid = false;
    }

    // if (!newPasswordConfirm) {
    //   isValid = false;
    //   newErrors.passwordConfirm = "새 비밀번호 재확인을 입력해주세요";
    // } else if (newPassword !== newPasswordConfirm) {
    //   isValid = false;
    //   newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
    // }

    // setErrors(newErrors);
    return isValid;
  };

  const validateCode = () => {
    if (code && code?.trim() === sentCode) {
      setShowResetPassword(true);
    } else {
      setErrors((prev) => ({ ...prev, code: "인증번호가 일치하지 않습니다" }));
    }
  };

  const generateVerificationCode = () => {
    const generatedCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    return generatedCode;
  };

  const handleVerifyEmailClick = async () => {
    if (await validateFindPasswordInput()) {
      try {
        const verifCode = generateVerificationCode();
        setSentCode(verifCode);
        const data = sendVerificationEmail(email, verifCode);
        console.log(data);
        setVerifyCodeSent(true);
      } catch (error) {
        console.error(
          "error sending verification code in password modal",
          error
        );
      }
      // setShowResetPassword(true);
    }
  };

  const handleResetPasswordClick = async () => {
    if (validateResetPasswordInput()) {
      try {
        await resetPasswordWithEmail(email, newPassword);
        console.log("비밀번호 재설정 성공");
        // toggleModal();
        setIsAlertModalVisible(true);
      } catch (error) {
        console.log("error resetting password in password modal");
      }
    }
  };

  //로그인 모달창이 뜨도록 해야함
  const handleLoginClick = () => {
    toggleModal();
  };

  return (
    <>
      <ModalLayout>
        <img src={logo} alt="logo" width={120} className="mb-14" />
        {!showResetPassword ? (
          <div className="flex flex-col gap-1 justify-center items-center">
            <Input
              label="이메일"
              value={email}
              onChange={handleEmailChange}
              error={errors.email}
            />
            {verifyCodeSent && (
              <Input
                label="인증번호"
                value={code}
                onChange={handleCodeChange}
                error={errors.code}
              />
            )}
            {errors.findPassword && (
              <div className="text-red-500 text-xs">{errors.findPassword}</div>
            )}
            <br />
            {!verifyCodeSent ? (
              <Button label="이메일 인증" onClick={handleVerifyEmailClick} />
            ) : (
              <Button label="인증하기" onClick={validateCode} />
            )}
            <Button
              label="로그인"
              color="bright-orange"
              onClick={handleLoginClick}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-1 justify-center items-center">
            <div className={`${errors.password && "mb-4"}`}>
              <Input
                label="새 비밀번호"
                type="password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                error={errors.password}
              />
            </div>
            <Input
              label="새 비밀번호 확인"
              type="password"
              value={newPasswordConfirm}
              onChange={handleNewPasswordConfirmChange}
              error={errors.passwordConfirm}
            />
            <br />
            <Button
              label="비밀번호 재설정"
              onClick={handleResetPasswordClick}
            />
            <Button
              label="로그인"
              color="bright-orange"
              onClick={handleLoginClick}
            />
          </div>
        )}
      </ModalLayout>
      {isAlertModalVisible && (
        <AlertModal
          headerEmoji={"✔️"}
          line1={"비밀번호 변경이 완료 됐습니다!"}
          line2={"로그인 후 이용해 주세요."}
          button1={{ label: "확인", onClick: toggleModal }}
        />
      )}
    </>
  );
};

export default FindPasswordModal;
