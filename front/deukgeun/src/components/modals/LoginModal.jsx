import React from "react";
import ModalLayout from "./ModalLayout";
import logo from "../../assets/dg_logo.png";
import Input from "../inputs/Input";

const LoginModal = ({ toggleModal }) => {
  return (
    <ModalLayout toggleModal={toggleModal}>
      <img src={logo} alt="logo" width={120} />
      <div className="flex flex-col gap-1 justify-center">
        <Input className="h-[48px]" label="이메일" />
        <Input className="h-[48px]" label="비밀번호" type="password" />
      </div>
    </ModalLayout>
  );
};

export default LoginModal;
