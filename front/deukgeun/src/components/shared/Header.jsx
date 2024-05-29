import React, { useState } from "react";
import logo from "../../assets/dg_logo.png";
import { Link } from "react-router-dom";
import LoginModal from "../modals/LoginModal";

console.log(logo);
export default function Header() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const toggleModal = () => {
    console.log(isModalVisible);
    setIsModalVisible(!isModalVisible);
  };

  return (
    <div className="flex justify-between items-center w-full px-5 border-b-2 border-black">
      <img className="w-24" src={logo} alt="logo" />
      <button onClick={toggleModal}>로그인</button>
      {isModalVisible ? <LoginModal toggleModal={toggleModal} /> : ""}
    </div>
  );
}
