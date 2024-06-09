import React from "react";
import DaumPostcode from "react-daum-postcode";
import ModalLayout from "./ModalLayout";

// https://postcode.map.daum.net/guide#usage
const AddressModal = ({ userData, setUserData, toggleModal }) => {
  const handleComplete = (data) => {
    console.log(data);
    setUserData({ ...userData, address: data.address });
    toggleModal();
  };

  return (
    <ModalLayout toggleModal={toggleModal}>
      <DaumPostcode
        // className="z-50 w-full h-full fixed left-0 top-0 bg-gray-500"
        className="!h-[500px]"
        autoClose
        onComplete={handleComplete}
      />
    </ModalLayout>
  );
};

export default AddressModal;
