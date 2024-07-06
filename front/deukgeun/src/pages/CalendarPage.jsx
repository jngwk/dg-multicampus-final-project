import React from "react";
import Calendar from "../components/calendar/Calendar";
const CalendarPage = () => {
  return (
    <div className="w-full h-[80dvh] ">
      <div className=" w-[80%] h-[80dvh] flex justify-center items-center mx-auto rounded-md bg-white shadow-lg">
        <Calendar />
        {/* <Button label="전체 삭제" onClick={handleDeleteAll} /> */}
      </div>
    </div>
  );
};

export default CalendarPage;
