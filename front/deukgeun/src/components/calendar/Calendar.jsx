import React, { useState, useEffect } from "react";
import CalendarInputForm from "../../components/calendar/CalendarInputForm";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { v4 as uuidv4 } from "uuid";
import Button from "../../components/shared/Button";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  registerWorkoutSession,
  modifyWorkoutSession,
  deleteWorkoutSession,
  getWorkoutSessions,
  getWorkouts,
  deleteWorkout,
} from "../../api/workoutSessionApi";
import Fallback from "../../components/shared/Fallback";
import { useAuth } from "../../context/AuthContext";
import { registerPTSession } from "../../api/ptSessionApi";

// TODO 트레이나/일반 구분하기
// security 설정해서 바꾸기
const Calendar = ({ editable = true, trainerId = null }) => {
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
  const { userData } = useAuth();

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
      const result = await getWorkoutSessions(startDate, endDate, trainerId);
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
      console.log("add Event @@@ 넘어가는 데이터", formValues);
      var result = "";
      if (userData.role === "ROLE_GENERAL") {
        result = await registerWorkoutSession(formValues);
        console.log("registering session as general", result);
      } else if (userData.role === "ROLE_TRAINER") {
        console.log("trainer");
        result = await registerPTSession(formValues);
        console.log("registering session as trainer", result);
      }
      const newEvent = formatFormValues(
        formValues,
        result.workoutSessionId,
        result.ptSession ? result.ptSession : ""
      );
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
    if (info.event === selectedEvent) return;
    setSelectedEvent(info.event);
    console.log(info);
    console.log("load workout", info.event);
    if (editable) loadWorkouts(info.event);

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
    const color = session.ptSession ? "#1e88e5" : "#43a047";
    const isEditable =
      userData.role === "ROLE_TRAINER"
        ? editable
        : session.ptSession
        ? false
        : editable;
    return {
      id: session.workoutSessionId,
      title:
        userData.role === "ROLE_GENERAL" && !trainerId
          ? session.content
          : session.ptSession.pt.user.userName,
      start: new Date(`${session.workoutDate}T${session.startTime}`),
      end: new Date(`${session.workoutDate}T${session.endTime}`),
      color: color,
      editable: isEditable,
      extendedProps: session,
    };
  };

  // 등록할 때 formValue를 event 객체의 포맷과 동일하게 수정
  const formatFormValues = (formValues, selectedEventId, ptSession = null) => {
    const id = selectedEventId ? selectedEventId : "";
    const color = formValues.ptSession ? "#1e88e5" : "#43a047";
    const isEditable =
      userData.role === "ROLE_TRAINER"
        ? editable
        : formValues.ptSession
        ? false
        : editable;
    if (!ptSession) ptSession = formValues.ptSession;
    console.log(formValues, selectedEventId, ptSession, id, color);
    return {
      id: id,
      title:
        userData.role === "ROLE_GENERAL" && !trainerId
          ? formValues.content
          : formValues.ptSession.pt.user.userName,
      start: new Date(`${formValues.workoutDate}T${formValues.startTime}`),
      end: new Date(`${formValues.workoutDate}T${formValues.endTime}`),
      color: color,
      editable: isEditable,
      extendedProps: { ...formValues, ptSession: ptSession ? ptSession : null },
    };
  };

  // const setEventEditable = (event) => {
  //   console.log("editable", event);
  //   if (userData.role === "ROLE_GENERAL" && event.color === "#CFEB7F") {
  //     return true;
  //   } else if (userData.role === "ROLE_GENERAL" && event.color === "#E6F4FF") {
  //     return false;
  //   }
  //   return true; // Default to true if no conditions match
  // };

  if (loading) {
    return <Fallback />;
  }
  return (
    <>
      <div className="xl:w-9/12 p-8 slide">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={
            userData.role === "ROLE_GENERAL" ? "dayGridMonth" : "timeGridWeek"
          }
          scrollTimeReset={false}
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
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          eventTimeFormat={{ hour: "2-digit", minute: "2-digit" }}
          dayMaxEventRows={3}
          height={"70dvh"}
        />
      </div>
      {editable && (
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
      )}
    </>
  );
};

export default Calendar;
