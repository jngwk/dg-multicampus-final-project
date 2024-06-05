import React, { useState } from "react";
import Layout from "../components/shared/Layout";
import CalendarInputForm from "../components/calendar/CalendarInputForm";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

// TODO DB에 저장된 값들 불러와서 캘린더에 추가
// TODO 트레이나/일반 구분하기
const CalendarPage = () => {
  const [events, setEvents] = useState("");
  const addEvent = (formValues) => {
    setEvents([
      ...events,
      {
        title: formValues.summary,
        start: new Date(`${formValues.date}T${formValues.startTime}`),
        end: new Date(`${formValues.date}T${formValues.endTime}`),
        color: "#ffbe98",
        extendedProps: formValues, // 받아온 form value 넘겨주기
      },
    ]);
    // TODO DB에 내용 저장하기
  };

  // 날짜 클릭시
  const handleDateClick = (info) => {
    console.log("Date clicked: ", info.dateStr);
    // TODO 운동 추가 창 띄우기
  };

  // 이벤트 클릭시
  const handleEventClick = (info) => {
    console.log("Event details:", info.event);
    console.log("Event extendedProps:", info.event.extendedProps);
    // TODO 기록된 운동 창 띄우기
  };

  // 이벤트 드래그 & 드롭시
  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) => {
      // TODO extendedProps에 날짜/시간도 변경하기
      if (event.id === info.event.id) {
        return {
          ...event,
          start: info.event.start.toISOString(),
          end: info.event.end ? info.event.end.toISOString() : null,
        };
      }
      return event;
    });

    setEvents(updatedEvents);
  };

  return (
    <Layout>
      <div className="xl:w-8/12 mt-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "",
            center: "title",
            end: "dayGridMonth,timeGridWeek today prev,next",
          }}
          weekends={true}
          events={events}
          selectable={true}
          editable={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
        />
      </div>
      <div className="mt-4">
        <CalendarInputForm addEvent={addEvent} />
      </div>
    </Layout>
  );
};
export default CalendarPage;
