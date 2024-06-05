import React from "react";
import Layout from "../components/shared/Layout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const events = [
  {
    title: "하체",
    start: new Date(),
  },
];

const CalendarPage = () => {
  return (
    <Layout>
      <div className="xl:w-8/12 mt-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth" // timeGridWeek
          headerToolbar={{
            start: "",
            center: "title",
            end: "dayGridMonth,timeGridWeek today prev,next",
          }}
          weekends={true}
          events={events}
          // eventContent={renderEventContent} // dayGrid에 한줄로 이벤트 표시
          // height={"60vh"}
        />
      </div>
    </Layout>
  );
};

function renderEventContent(eventInfo) {
  return (
    <>
      {/* <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i> */}
      {/* <b>12:00</b>
      <i>PT</i> */}
    </>
  );
}
export default CalendarPage;
