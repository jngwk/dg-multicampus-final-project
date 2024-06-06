import React, { useState, useEffect } from "react";
import Layout from "../components/shared/Layout";
import CalendarInputForm from "../components/calendar/CalendarInputForm";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuidv4 } from "uuid";

// TODO 트레이나/일반 구분하기
const CalendarPage = () => {
  const [events, setEvents] = useState(() => {
    // local storage에서 저장된 이벤트 받아오기
    // TODO DB에 저장된 값들 불러와서 캘린더에 추가
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [selectedDate, setSelectedDate] = useState(
    // default를 오늘 날짜로 설정 (custom hook으로 사용할지 고민)
    new Date().toISOString().split("T")[0]
  );
  const [selectedEvent, setSelectedEvent] = useState("");
  const [isInputFormVisible, setIsInputFormVisible] = useState(false);

  // addEvent로 event 추가 후 events 업데이트가 되면 localStorage에 저장
  // TODO DB에 새로운 event 저장
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addEvent = (formValues) => {
    // 새로운 이벤트 생성
    const newEvent = {
      id: uuidv4(),
      title: formValues.summary,
      start: new Date(`${formValues.date}T${formValues.startTime}`),
      end: new Date(`${formValues.date}T${formValues.endTime}`),
      color: "#ffbe98",
      extendedProps: formValues,
    };

    // events에 추가
    setEvents((prevEvents) => [...prevEvents, newEvent]);
    console.log("이벤트 추가: ", newEvent);
  };

  // TODO 인풋폼 데이터 형태를 캘린더 JSON과 동일하게 변경 후 코드 전체적으로 수정
  // TODO 선택된 이벤트 업데이트
  const updateEvent = (formValues) => {
    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id
        ? { ...event, extendedProps: formValues }
        : event
    );
    setEvents(updatedEvents);
  };

  // 선택된 이벤트 삭제
  const deleteEvent = () => {
    const updatedEvents = events.filter(
      (event) => event.id !== selectedEvent.id
    );
    setEvents(updatedEvents);
  };

  // 날짜 클릭시
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    // console.log("Selected date: ", selectedDate);
    setSelectedEvent(null);
    // 운동 추가 창 띄우기
    !isInputFormVisible && toggleInputForm();
  };

  // 이벤트 클릭시
  // TODO 내용 수정 및 삭제 가능하게 하기
  const handleEventClick = (info) => {
    console.log("Event details:", info.event);
    console.log("Event extendedProps:", info.event.extendedProps);
    // event에 있는 값들 폼으로 옮기기
    setSelectedEvent(info.event);
    setSelectedDate(null);

    // 기록된 운동 창 띄우기
    !isInputFormVisible && toggleInputForm();
  };

  // 이벤트 드래그 & 드롭시 날짜 및 시간 변경
  const handleEventDrop = (info) => {
    // console.log("Info ID", info.event.id);
    const updatedEvents = events.map((event) => {
      // console.log("Event ID", event.id);
      if (event.id === info.event.id) {
        const start = info.event.startStr;
        const startDate = start.split("T")[0];
        const startTime = formatTime(start.split("T")[1]);

        // console.log("start", start);
        // console.log("startDate", startDate);
        // console.log("startTime", startTime);

        const end = info.event.endStr;
        const endDate = end.split("T")[0];
        const endTime = formatTime(end.split("T")[1]);
        const extendedProps = event.extendedProps;

        const updatedEvent = {
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

        setSelectedEvent(updatedEvent);
        return updatedEvent;
      }
      return event;
    });

    setEvents(updatedEvents);
  };

  // Input form visibility를 toggle
  // TODO 슬라이딩 effect 추가
  const toggleInputForm = () => {
    setIsInputFormVisible(!isInputFormVisible);
  };

  // TODO 이벤트 드래그로 시간 연장/단축시 폼 시간 변경

  // 시간 포맷
  const formatTime = (timeString) => {
    return timeString.split("+")[0];
  };

  return (
    <Layout>
      <div className="xl:w-8/12 p-8">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            start: "title",
            center: "",
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
        <CalendarInputForm
          addEvent={addEvent}
          updateEvent={updateEvent}
          deleteEvent={deleteEvent}
          selectedDate={selectedDate}
          selectedEvent={selectedEvent}
          isInputFormVisible={isInputFormVisible}
          toggleInputForm={toggleInputForm}
        />
      </div>
    </Layout>
  );
};
export default CalendarPage;
