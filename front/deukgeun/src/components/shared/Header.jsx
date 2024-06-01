import logo from "../../assets/dg_logo.png";
import LoginModal from "../modals/LoginModal";
import { useModal } from "../../hooks/useModal";


console.log(logo);
export default function Header() {
  const { isModalVisible, toggleModal } = useModal();

  return (
    <div className="flex justify-between items-center w-full px-5 border-b-2 border-black">
      <img className="w-24" src={logo} alt="logo" />
      
      <button onClick={toggleModal}>로그인</button>
      {isModalVisible ? <LoginModal toggleModal={toggleModal} /> : ""}
    </div>
  );
}
