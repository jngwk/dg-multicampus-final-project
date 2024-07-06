import React from "react";
import Calendar from "../components/calendar/Calendar";
const CalendarPage = () => {
  return (
    <div className="w-full h-[80dvh] flex justify-center items-center">
      <Calendar />
      {/* <Button label="전체 삭제" onClick={handleDeleteAll} /> */}
    </div>
  );
};

export default CalendarPage;
