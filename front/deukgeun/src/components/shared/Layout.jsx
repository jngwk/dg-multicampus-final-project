import React from "react";
import Header from "./Header";
import { useLoginModalContext } from "../../context/LoginModalContext";
import LoginModal from "../../components/modals/LoginModal";

const Layout = ({ children }) => {
  const { toggleLoginModal, isLoginModalVisible } = useLoginModalContext();

  return (
    <div>
      <Header />
      <div className="justify-center min-h-[90dvh] w-full">{children}</div>
      {isLoginModalVisible && <LoginModal toggleModal={toggleLoginModal} />}
    </div>
  );
};

export default Layout;
