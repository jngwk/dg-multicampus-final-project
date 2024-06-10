import React, { useState, useEffect } from "react";
import Layout from "../components/shared/Layout";
import CalendarInputForm from "../components/calendar/CalendarInputForm";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/shared/Button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  registerWorkoutSession,
  modifyWorkoutSession,
  deleteWorkoutSession,
  getWorkoutSessions,
} from "../api/workoutSessionApi";

// TODO 트레이나/일반 구분하기
const CalendarPage = () => {
  // TODO TOKEN 에서 받아오기
  const userId = 1;
  const [events, setEvents] = useState(() => {
    // TODO DB에 저장된 값들 불러와서 캘린더에 추가
    // local storage에서 저장된 이벤트 받아오기
    const savedEvents = localStorage.getItem("events");
    return savedEvents ? JSON.parse(savedEvents) : [];
  });
  const [selectedDate, setSelectedDate] = useState(
    // default를 오늘 날짜로 설정
    new Date().toISOString().split("T")[0]
    // TODO custom hook으로 사용할지 고민
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isInputFormVisible, setIsInputFormVisible] = useState(false);
  const [error, setError] = useState("");

  // TODO DB에 새로운 event 저장
  // addEvent로 event 추가 후 events 업데이트가 되면 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
    console.log("Events updated: ", events);
  }, [events]);

  const addEvent = async (formValues) => {
    // events에 추가
    try {
      // userId 1인 회원 만들고 테스트
      const result = await registerWorkoutSession(userId, formValues);
      console.log(result);
      const newEvent = formatFormValues(formValues, result.workoutSessionId);
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      setSelectedEvent(newEvent);
      // console.log("이벤트 추가: ", newEvent);
    } catch (error) {
      setError("데이터 베이스에 저장하는데 실패했습니다.");
      console.log("Register post mapping error: ", error);
    }
  };

  const updateEvent = async (formValues) => {
    try {
      // userId 1인 회원 만들고 테스트
      const result = await modifyWorkoutSession(
        userId,
        formValues,
        selectedEvent.id
      );
      console.log(result);
      const updatedEvent = formatFormValues(formValues, selectedEvent.id);
      const updatedEvents = events.map((event) =>
        event.id == selectedEvent.id ? updatedEvent : event
      );
      setEvents(updatedEvents);
      // console.log("이벤트 업데이트: ", updatedEvent);
    } catch (error) {
      setError("데이터 베이스에 업데이트하는데 실패했습니다.");
      console.log("Modify put mapping error: ", error);
    }
  };

  // 선택된 이벤트 삭제
  const deleteEvent = async () => {
    try {
      const result = await deleteWorkoutSession(selectedEvent.id);
      console.log(result);
      const updatedEvents = events.filter(
        (event) => event.id != selectedEvent.id
      );
      setSelectedEvent(null);
      setEvents(updatedEvents);
      setIsInputFormVisible(false);
    } catch (error) {
      setError("데이터 베이스에서 삭제하는데 실패했습니다.");
      console.log("Delete mapping error: ", error);
    }
  };

  // 날짜 range 변경시
  const handleDatesSet = async (info) => {
    const startDate = info.startStr.split("T")[0];
    const endDate = info.endStr.split("T")[0];

    console.log(startDate);
    try {
      const result = await getWorkoutSessions(startDate, endDate, userId);
      console.log("Get result: ", result);
      const newEvents = result.map((session) => formatSessionToEvent(session));
      setEvents(newEvents);
    } catch (error) {
      setError("데이터 베이스에서 불러오는데 실패했습니다.");
      console.log("Get mapping error: ", error);
    }
  };

  // 날짜 클릭시
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setSelectedEvent(null);
    // 운동 추가 창 띄우기
    setIsInputFormVisible(true);
  };

  // 이벤트 클릭시
  // TODO 내용 수정 및 삭제 가능하게 하기
  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setSelectedDate(null);
    // 기록된 운동 창 띄우기
    setIsInputFormVisible(true);
  };

  // 이벤트 드래그 & 드롭시 날짜 및 시간 변경
  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) => {
      if (event.id == info.event.id) {
        console.log(info.event);
        const start = info.event.startStr;
        const startDate = start.split("T")[0];
        const startTime = formatTime(start.split("T")[1]);

        const end = info.event.endStr;
        const endDate = end.split("T")[0];
        const endTime = end ? formatTime(end.split("T")[1]) : "";

        const updatedFormValues = {
          ...event.extendedProps,
          date: startDate,
          startTime: startTime,
          endDate: endDate,
          endTime: endTime,
        };

        setSelectedEvent(info.event);

        updateEvent(updatedFormValues);

        return formatFormValues(updatedFormValues, event.id);
      }
      return event;
    });

    setEvents(updatedEvents);
  };

  const handleDeleteAll = () => {
    setEvents([]);
    setIsInputFormVisible(false);
  };

  // Input form visibility를 toggle
  // TODO 슬라이딩 effect 추가
  const toggleInputForm = () => {
    setIsInputFormVisible(!isInputFormVisible);
  };

  // TODO 이벤트 드래그로 시간 연장/단축시 폼 시간 변경

  // 시간 포맷
  const formatTime = (timeString) => {
    const time = timeString.split("+")[0];
    const formattedTime = time.split(":")[0] + ":" + time.split(":")[1];
    console.log(formattedTime);
    return formattedTime;
  };

  const customTitleFormat = ({ date }) => {
    return format(date.marker, "yyyy년 M월", { locale: ko });
  };

  // DB에서 받아온 data를 format
  const formatSessionToEvent = (session) => {
    return {
      id: session.workoutSessionId,
      title: session.content,
      start: new Date(`${session.workoutDate}T${session.startTime}`),
      end: new Date(`${session.workoutDate}T${session.endTime}`),
      color: "#ffbe98",
      extendedProps: session,
    };
  };

  // formValue를 event 객체의 포맷과 동일하게 수정
  const formatFormValues = (formValues, selectedEventId) => {
    const id = selectedEventId ? selectedEventId : uuidv4();
    return {
      id: id,
      title: formValues.content,
      start: new Date(`${formValues.date}T${formValues.startTime}`),
      end: new Date(`${formValues.date}T${formValues.endTime}`),
      color: "#ffbe98",
      extendedProps: formValues,
    };
  };

  return (
    <>
      <div className="xl:w-8/12 p-8 slide">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          titleFormat={(date) => customTitleFormat(date)}
          datesSet={handleDatesSet}
          headerToolbar={{
            start: "",
            center: "title",
            end: "timeGridWeek,dayGridMonth today",
          }}
          footerToolbar={{
            start: "",
            center: "",
            end: "prev,next",
          }}
          weekends={true}
          events={events}
          selectable={true}
          editable={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventTimeFormat={{ hour: "2-digit", minute: "2-digit" }}
          height={"80dvh"}
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
      <Button label="전체 삭제" onClick={handleDeleteAll} />
    </>
  );
};

export default CalendarPage;
