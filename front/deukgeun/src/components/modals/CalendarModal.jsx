import React from "react";
import ModalLayout from "./ModalLayout";
// import CalendarPage from "../../pages/CalendarPage";
import Calendar from "../calendar/Calendar";

const CalendarModal = ({ toggleModal, receiverId }) => {
  return (
    <ModalLayout toggleModal={toggleModal}>
      <div className="flex justify-center items-center w-[1500px]">
        <Calendar editable={!!!receiverId} trainerId={receiverId} />
      </div>
    </ModalLayout>
  );
};

export default CalendarModal;
