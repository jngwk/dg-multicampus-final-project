import React, { useState } from "react";
import Layout from "../components/shared/Layout";
import CalendarInputForm from "../components/calendar/CalendarInputForm";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuidv4 } from "uuid";

// TODO DB에 저장된 값들 불러와서 캘린더에 추가
// TODO 트레이나/일반 구분하기
const CalendarPage = () => {
  const [events, setEvents] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    // default를 오늘 날짜로 설정
    new Date().toISOString().split("T")[0]
  );

  const addEvent = (formValues) => {
    setEvents([
      ...events,
      {
        // uuid 생성
        id: uuidv4(),
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
    setSelectedDate(info.dateStr);
    console.log("Selected date: ", selectedDate);
    // TODO 운동 추가 창 띄우기
  };

  // 이벤트 클릭시
  // TODO event에 있는 값들 폼으로 옮기기
  const handleEventClick = (info) => {
    console.log("Event details:", info.event);
    console.log("Event extendedProps:", info.event.extendedProps);
    // TODO 기록된 운동 창 띄우기
  };

  // 이벤트 드래그 & 드롭시 날짜 및 시간 변경
  const handleEventDrop = (info) => {
    // console.log("Info ID", info.event.id);
    const updatedEvents = events.map((event) => {
      // console.log("Event ID", event.id);
      if (event.id === info.event.id) {
        const start = info.event.startStr;
        // console.log("start", start);
        const startDate = start.split("T")[0];
        // console.log("startDate", startDate);
        const startTime = start.split("T")[1];
        // console.log("startTime", startTime);

        const end = info.event.endStr;
        const endDate = end.split("T")[0];
        const endTime = end.split("T")[1];
        const extendedProps = event.extendedProps;

        return {
          ...event,
          start: start,
          end: info.event.end ? end : null,
          extendedProps: {
            ...extendedProps,
            date: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
          },
        };
      }
      return event;
    });

    setEvents(updatedEvents);
  };

  // TODO 이벤트 드래그로 연장시 시간 변경

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
        <CalendarInputForm addEvent={addEvent} selectedDate={selectedDate} />
      </div>
    </Layout>
  );
};
export default CalendarPage;
