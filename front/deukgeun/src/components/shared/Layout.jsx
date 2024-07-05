import React from "react";
import Header from "./Header";
import { useLoginModalContext } from "../../context/LoginModalContext";
import LoginModal from "../../components/modals/LoginModal";

const Layout = ({ children }) => {
  const { toggleLoginModal, isLoginModalVisible } = useLoginModalContext();

  return (
    <div className="snap-y snap-proximity overflow-y-auto justify-center min-h-[100dvh] h-screen w-full">
      <Header />
      {children}

      {isLoginModalVisible && <LoginModal toggleModal={toggleLoginModal} />}
    </div>
  );
};

export default Layout;
