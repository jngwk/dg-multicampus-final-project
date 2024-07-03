import React from "react";
import ModalLayout from "./ModalLayout";
import MemberRegister from "../../pages/MemberRegister";

const MemberRegisterModal = (toggleModal) => {
  return (
    <ModalLayout toggleModal={toggleModal}>
      <MemberRegister />
    </ModalLayout>
  );
};

export default MemberRegisterModal;
