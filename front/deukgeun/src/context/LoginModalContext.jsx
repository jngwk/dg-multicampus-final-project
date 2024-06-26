import React, { createContext, useContext, useState } from "react";

const LoginModalContext = createContext();

export const useLoginModalContext = () => useContext(LoginModalContext);

export const LoginModalProvider = ({ children }) => {
  const [isLoginModalVisible, setIsLoginModalVisible] = useState(false);

  const toggleLoginModal = () => {
    setIsLoginModalVisible((prev) => !prev);
  };

  return (
    <LoginModalContext.Provider
      value={{ isLoginModalVisible, toggleLoginModal }}
    >
      {children}
    </LoginModalContext.Provider>
  );
};
