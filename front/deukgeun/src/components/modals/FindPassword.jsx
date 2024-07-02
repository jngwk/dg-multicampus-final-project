import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import { useModal } from "../../hooks/useModal";
import LoginModal from "../modals/LoginModal";
import logo from "../../assets/dg_logo_small.png";
import Input from "../shared/Input";
import Button from "../shared/Button";
import useCustomNavigate from "../../hooks/useCustomNavigate";

const initErrors = { name: "", email: "", password: "", passwordConfirm: "", findPassword: "" };

const FindPassword = () => {
    const customNavigate = useCustomNavigate();
    const [showResetPassword, setShowResetPassword] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
    const [errors, setErrors] = useState(initErrors);

    const { isModalVisible, toggleModal } = useModal();

    const handleNameChange = (e) => {
        setName(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, name: "" }));
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    };

    const handleNewPasswordConfirmChange = (e) => {
        setNewPasswordConfirm(e.target.value);
        setErrors((prevErrors) => ({ ...prevErrors, passwordConfirm: "" }));
    };

    const validateFindPasswordInput = () => {
        let isValid = true;
        const newErrors = { ...initErrors };

        // 임시 이름,이메일 - 데이터가져와야함
        const isValidName = name === "valid_name"; 
        const isValidEmail = email === "valid_email@example.com"; 

        if (!name) {
            isValid = false;
            newErrors.name = "이름을 입력해주세요";
        } else if (!isValidName) {
            isValid = false;
            newErrors.name = "이름을 다시 입력해주세요.";
        }

        if (!email) {
            isValid = false;
            newErrors.email = "이메일을 입력해주세요";
        } else if (!isValidEmail) {
            isValid = false;
            newErrors.email = "이메일을 다시 입력해주세요.";
        }

        setErrors(newErrors);
        return isValid;
    };

    const validateResetPasswordInput = () => {
        let isValid = true;
        const newErrors = { ...initErrors };

        if (!newPassword) {
            isValid = false;
            newErrors.password = "새 비밀번호를 입력해주세요";
        }

        if (!newPasswordConfirm) {
            isValid = false;
            newErrors.passwordConfirm = "새 비밀번호 재확인을 입력해주세요";
        } else if (newPassword !== newPasswordConfirm) {
            isValid = false;
            newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다";
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleFindPasswordClick = () => {
        if (validateFindPasswordInput()) {
            setShowResetPassword(true);
        }
    };

    const handleResetPasswordClick = () => {
        if (validateResetPasswordInput()) {
            console.log("비밀번호 재설정 성공");
            toggleModal();
            customNavigate("/"); 
        }
    };


    //로그인 모달창이 뜨도록 해야함
    const handleLoginClick = () => {
        toggleModal();
        customNavigate("/");        
    };

    const handleSignUpClick = () => {
        customNavigate("/signUp");
    };

    return (
        <ModalLayout toggleModal={toggleModal}>
            <img src={logo} alt="logo" width={120} className="mb-14" />
            {!showResetPassword ? (
                <div className="flex flex-col gap-1 justify-center items-center">
                    <Input label="이름" value={name} onChange={handleNameChange} error={errors.name} />
                    <Input label="이메일" value={email} onChange={handleEmailChange} error={errors.email} />
                    <br />
                    <Button label="비밀번호 찾기" onClick={handleFindPasswordClick} />
                    {errors.findPassword && <div className="text-red-500 text-xs">{errors.findPassword}</div>}
                    <br />
                    <br />
                    <div>
                        <button
                            className="px-2 text-[12px] border-r-2 border-gray-400 text-gray-400 hover:text-peach-fuzz"
                            onClick={handleLoginClick}
                        >
                            로그인 
                        </button>
                        <button 
                            className="px-2 text-[12px] text-gray-400 hover:text-peach-fuzz"
                            onClick={handleSignUpClick}
                        >
                            회원가입
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-1 justify-center items-center">
                    <div>Email: {email}</div>
                    <Input label="새 비밀번호" type="password" value={newPassword} onChange={handleNewPasswordChange} error={errors.password} />
                    <Input label="새 비밀번호 재확인" type="password" value={newPasswordConfirm} onChange={handleNewPasswordConfirmChange} error={errors.passwordConfirm} />
                    <br />
                    <Button label="비밀번호 재설정" onClick={handleResetPasswordClick} />
                    <br />
                    <div >
                    <button
                            className="px-2 text-[12px] border-r-2 border-gray-400 text-gray-400 hover:text-peach-fuzz"
                            onClick={handleLoginClick}
                        >
                            로그인 
                        </button>
                        <button 
                            className="px-2 text-[12px] text-gray-400 hover:text-peach-fuzz"
                            onClick={handleSignUpClick}
                        >
                            회원가입
                        </button>
                    </div>
                </div>
            )}
        </ModalLayout>
    );
};

export default FindPassword;
