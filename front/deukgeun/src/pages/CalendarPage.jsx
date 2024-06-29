import React, { useState, useEffect } from "react";
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
  getWorkouts,
  deleteWorkout,
} from "../api/workoutSessionApi";
import Fallback from "../components/shared/Fallback";

// TODO 트레이나/일반 구분하기
// security 설정해서 바꾸기
const CalendarPage = () => {
  const [events, setEvents] = useState(() => {
    // TODO DB에 저장된 값들 불러와서 캘린더에 추가
    // local storage에서 저장된 이벤트 받아오기
    // const savedEvents = localStorage.getItem("events");
    // return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [selectedDate, setSelectedDate] = useState(
    // default를 오늘 날짜로 설정
    new Date().toISOString().split("T")[0]
  );
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isInputFormVisible, setIsInputFormVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [workoutsLoading, setWorkoutsLoading] = useState(false);

  // TODO DB에 새로운 event 저장
  // addEvent로 event 추가 후 events 업데이트가 되면 localStorage에 저장
  useEffect(() => {
    // TODO loadEvents
    // const loadEvents = async () => {
    //   try {
    //     console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@");
    //     const result = await getWorkoutSessions(selectedDate, selectedDate);
    //     console.log("workoutSessionFetch results", result);
    //     const newEvents = result.map((session) =>
    //       formatSessionToEvent(session)
    //     );
    //     setEvents(newEvents);
    //   } catch (error) {
    //     setError("Failed to fetch workout sessions");
    //     console.error("Error fetching workout sessions:", error);
    //   }
    // };
    // loadEvents();
    setLoading(false);
  }, []);

  // (Load workout sessions) 날짜 range 변경시
  const loadWorkoutSessions = async (info) => {
    const startDate = info.startStr.split("T")[0];
    const endDate = info.endStr.split("T")[0];
    console.log("calling data from range: ", startDate, endDate);
    try {
      const result = await getWorkoutSessions(startDate, endDate);
      console.log("Get result: ", result);
      const newEvents = result.map((session) => formatSessionToEvent(session));
      setEvents(newEvents);
    } catch (error) {
      setError("데이터 베이스에서 불러오는데 실패했습니다.");
      console.log("Get mapping error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkouts = async (event) => {
    try {
      setWorkoutsLoading(true);
      const workoutList = await getWorkouts(event.id);
      console.log("Workout List", workoutList);
      setSelectedEvent({
        ...event,
        extendedProps: { ...event.extendedProps, workouts: workoutList },
      });
    } catch (error) {
      console.error("Error", error);
      throw error;
    } finally {
      setWorkoutsLoading(false);
    }
  };
  const addEvent = async (formValues) => {
    // events에 추가
    try {
      const result = await registerWorkoutSession(formValues);
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

  const updateEvent = async (formValues, id) => {
    console.log(selectedEvent);
    try {
      console.log("@@@@@@@@@@@넘어가는 데이터", formValues);
      const result = await modifyWorkoutSession(formValues, id);

      const updatedEvent = formatFormValues(formValues, id);
      console.log("@@@@@선택된 이벤트", updatedEvent);

      setSelectedEvent(updatedEvent);
      // console.log("@@@@CHECK", updatedEvent);

      const updatedEvents = events.map((event) =>
        event.id == id ? updatedEvent : event
      );
      setEvents(updatedEvents);
      // console.log("이벤트 업데이트: ", updatedEvent);
    } catch (error) {
      setError("데이터 베이스에 업데이트하는데 실패했습니다.");
      console.log("Modify put mapping error: ", error);
    }
  };

  // 선택된 이벤트 삭제
  const deleteEvent = async (id) => {
    try {
      const result = await deleteWorkoutSession(id);
      console.log(result);
      const updatedEvents = events.filter((event) => event.id != id);
      setSelectedEvent(null);
      setEvents(updatedEvents);
      setIsInputFormVisible(false);
    } catch (error) {
      setError("데이터 베이스에서 삭제하는데 실패했습니다.");
      console.log("Delete mapping error: ", error);
    }
  };

  const deleteWorkouts = async (workoutList) => {
    try {
      const promises = workoutList.map(async (workoutId) => {
        const res = await deleteWorkout(workoutId);
        console.log("Deleted workoutId:", workoutId, res);
      });
      await Promise.all(promises);
    } catch (error) {
      console.error("Error deleting workouts", error);
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

    console.log("load workout");
    loadWorkouts(info.event);

    setSelectedDate(null);
    // 기록된 운동 창 띄우기
    setIsInputFormVisible(true);
  };

  // 이벤트 드래그 & 드롭시 날짜 및 시간 변경
  const handleEventDrop = (info) => {
    setSelectedEvent(info.event);
    // console.log(selectedEvent);
    const updatedEvents = events.map((event) => {
      if (event.id == info.event.id) {
        console.log("@@@@@@", info.event);
        const start = info.event.startStr;
        const startDate = start.split("T")[0];
        const startTime = formatTime(start.split("T")[1]);

        const end = info.event.endStr;
        const endDate = end.split("T")[0];
        const endTime = end ? formatTime(end.split("T")[1]) : "";

        console.log("@@@@@@@ 시간 변경", startTime, endTime);

        const updatedFormValues = {
          ...event.extendedProps,
          workoutDate: startDate,
          startTime: startTime,
          endDate: endDate,
          endTime: endTime,
        };

        updateEvent(updatedFormValues, event.id);

        return formatFormValues(updatedFormValues, event.id);
      }
      console.log("load workout");
      handleEventClick(info);
      return event;
    });

    setEvents(updatedEvents);
  };

  // 테스팅용
  // const handleDeleteAll = () => {
  //   setEvents([]);
  //   setIsInputFormVisible(false);
  // };

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
      start: new Date(`${formValues.workoutDate}T${formValues.startTime}`),
      end: new Date(`${formValues.workoutDate}T${formValues.endTime}`),
      color: "#ffbe98",
      extendedProps: formValues,
    };
  };

  if (loading) {
    return <Fallback />;
  }
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="xl:w-9/12 p-8 slide">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          titleFormat={(date) => customTitleFormat(date)}
          datesSet={loadWorkoutSessions}
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
      <div className="flex justify-center h-[65dvh] items-center border-2 border-r-0 rounded-tr-none rounded-br-none border-peach-fuzz rounded-md py-5">
        <div onClick={toggleInputForm} className="cursor-pointer p-5">
          ||
        </div>
        <div
          className={`relative ${
            isInputFormVisible ? "w-[300px]" : "w-0"
          }  overflow-hidden transition-all ease-in-out duration-1000`}
        >
          <CalendarInputForm
            addEvent={addEvent}
            updateEvent={updateEvent}
            deleteEvent={deleteEvent}
            selectedDate={selectedDate}
            selectedEvent={selectedEvent}
            isInputFormVisible={isInputFormVisible}
            toggleInputForm={toggleInputForm}
            workoutsLoading={workoutsLoading}
            deleteWorkouts={deleteWorkouts}
          />
        </div>
      </div>
      {/* <Button label="전체 삭제" onClick={handleDeleteAll} /> */}
    </div>
  );
};

export default CalendarPage;
