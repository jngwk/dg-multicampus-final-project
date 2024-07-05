import React, { useEffect } from "react";

const ModalLayout = ({ children, toggleModal, className }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center z-50 overflow-hidden"
      onClick={toggleModal}
    >
      <div
        className={`min-h-80 h-fit min-w-[560px] bg-white rounded-3xl flex flex-col justify-center items-center md:py-20 md:px-20 py-16 px-6 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalLayout;
