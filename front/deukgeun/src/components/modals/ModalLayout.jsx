import React from "react";

const ModalLayout = ({ children, toggleModal }) => {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center z-50"
      onClick={toggleModal}
    >
      <div
        className="min-h-80 h-fit w-[560px] bg-white rounded-3xl flex flex-col justify-center items-center py-20 px-20"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalLayout;
