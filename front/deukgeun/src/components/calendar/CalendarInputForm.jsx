import React, { useState, useEffect } from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import useCustomDate from "../../hooks/useCustomDate";
import Loader from "../shared/Loader";

// 캘린더 포맷이랑 일치하게 수정하기
const CalendarInputForm = ({
  addEvent,
  updateEvent,
  deleteEvent,
  selectedDate,
  selectedEvent,
  isInputFormVisible,
  toggleInputForm,
  workoutsLoading,
  deleteWorkouts,
}) => {
  const { computeTime, getTime } = useCustomDate();

  const [formValues, setFormValues] = useState({
    workoutDate: "",
    startTime: "",
    endTime: "",
    // client: "",
    content: "",
    bodyWeight: "",
    memo: "",
    workouts: [
      { workoutName: "", workoutSet: "", workoutRep: "", workoutWeight: "" },
    ],
  });
  const [deletedWorkouts, setDeletedWorkouts] = useState([]);

  // 날짜/이벤트 선택시 폼에 반영
  useEffect(() => {
    setDeletedWorkouts([]);
    if (selectedEvent) {
      setFormValues({
        ...selectedEvent.extendedProps,
        workouts: selectedEvent.extendedProps.workouts || [
          {
            workoutName: "",
            workoutSet: "",
            workoutRep: "",
            workoutWeight: "",
          },
        ],
      });
      console.log("selectedEvent", selectedEvent);
    } else if (selectedDate) {
      const selectedTime = selectedDate.split("T")[1];
      setFormValues({
        workoutDate: selectedDate.split("T")[0],
        startTime: selectedTime ? computeTime(selectedTime) : getTime(),
        endTime: selectedTime ? computeTime(selectedTime, 0.5) : getTime(1),
        workouts: [
          {
            workoutName: "",
            workoutSet: "",
            workoutRep: "",
            workoutWeight: "",
          },
        ],
      });
      console.log("selectedTime: ", formValues.startTime);
    }
  }, [selectedDate, selectedEvent]);

  // workout 제외 나머지 input 수정시
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues, // 기존 state 가져오기
      [name]: value, // state에서 name과 일치하는 value 수정
    });
  };

  // workout 수정시
  const handleWorkoutChange = (index, e) => {
    const { name, value } = e.target;
    const updatedWorkouts = [...formValues.workouts];
    updatedWorkouts[index] = {
      ...updatedWorkouts[index],
      [name]: value,
    };
    setFormValues({
      ...formValues,
      workouts: updatedWorkouts,
    });
  };

  // 새로운 workout input 추가
  // TODO 빈 workout 예외 처리 필요
  const handleAddWorkout = () => {
    setFormValues({
      ...formValues,
      workouts: [
        ...formValues.workouts,
        {
          workoutName: "",
          workoutSet: "",
          workoutRep: "",
          workoutWeight: "",
        },
      ],
    });
  };

  const handleDeleteWorkout = (index, id) => {
    // TODO handle delete workout
    const updatedWorkouts = formValues.workouts.filter((_, i) => i !== index);
    setFormValues({
      ...formValues,
      workouts: updatedWorkouts,
    });
    if (id) {
      setDeletedWorkouts((prev) => [...prev, id]);
    }
  };

  const handleSubmit = (e) => {
    // console.log(
    //   "handleSubmit: ",
    //   selectedEvent.id || selectedEvent.extendedProps.workoutSessionId
    // );
    if (selectedEvent) {
      if (deletedWorkouts) {
        deleteWorkouts(deletedWorkouts);
      }
      updateEvent(
        formValues,
        selectedEvent.id || selectedEvent.extendedProps.workoutSessionId
      );
    } else {
      addEvent(formValues);
    }
    // selectedEvent
    //   ? updateEvent(
    //       formValues,
    //       selectedEvent.id || selectedEvent.extendedProps.workoutSessionId
    //     )
    //   : addEvent(formValues);
  };

  const handleDelete = () => {
    console.log("handleDelete");
    deleteEvent(
      selectedEvent.id || selectedEvent.extendedProps.workoutSessionId
    );
  };

  return (
    <div className="xl:absolute xl:left-3/4 xl:top-56 h-4/6 w-72">
      <span className="hover:cursor-pointer" onClick={toggleInputForm}>
        보이기/숨기기
      </span>
      {isInputFormVisible && (
        <div className="h-5/6 overflow-scroll overflow-x-hidden">
          <Input
            label="날짜"
            name="workoutDate"
            type="date"
            value={formValues.workoutDate || ""}
            onChange={handleChange}
          />
          <Input
            label="시작 시간"
            name="startTime"
            type="time"
            step="1800"
            value={formValues.startTime || ""}
            onChange={handleChange}
          />
          <Input
            label="종료 시간"
            name="endTime"
            type="time"
            step="1800"
            value={formValues.endTime || ""}
            onChange={handleChange}
          />
          <hr />
          {/* <Input
            label="회원"
            name="client"
            value={formValues.client}
            onChange={handleChange}
          /> */}
          <Input
            label="제목"
            name="content"
            value={formValues.content || ""}
            onChange={handleChange}
          />

          {workoutsLoading ? (
            <Loader />
          ) : (
            formValues.workouts.map((workout, index) => (
              <div
                key={index}
                id={workout.workoutId || ""}
                className="flex gap-2 items-center"
              >
                <div className="w-[240px]">
                  <hr />
                  <Input
                    label="운동"
                    name="workoutName"
                    value={workout.workoutName || ""}
                    onChange={(e) => handleWorkoutChange(index, e)}
                  />
                  <div className="flex justify-between">
                    <Input
                      label="SET"
                      name="workoutSet"
                      type="number"
                      value={workout.workoutSet || ""}
                      onChange={(e) => handleWorkoutChange(index, e)}
                      width="28%"
                    />
                    <Input
                      label="REP"
                      name="workoutRep"
                      type="number"
                      value={workout.workoutRep || ""}
                      onChange={(e) => handleWorkoutChange(index, e)}
                      width="28%"
                    />
                    <Input
                      label="무게(KG)"
                      name="workoutWeight"
                      type="number"
                      value={workout.workoutWeight || ""}
                      onChange={(e) => handleWorkoutChange(index, e)}
                      width="36%"
                    />
                  </div>
                </div>
                <div
                  className="w-6 h-[100px] border border-gray-400 opacity-0 hover:opacity-100 transition-opacity flex justify-center items-center cursor-pointer rounded-md bg-gray-50"
                  onClick={() =>
                    handleDeleteWorkout(index, workout.workoutId || "")
                  }
                >
                  <box-icon name="x" color="#bdbdbd"></box-icon>
                </div>
              </div>
            ))
          )}
          <Button label="+" onClick={handleAddWorkout} />
          <hr />
          <Input
            label="몸무게(KG)"
            name="bodyWeight"
            type="number"
            value={formValues.bodyWeight || ""}
            onChange={handleChange}
          />
          <Input
            label="메모"
            name="memo"
            value={formValues.memo || ""}
            onChange={handleChange}
          />
          <Button
            label={selectedEvent ? "수정" : "작성"}
            onClick={handleSubmit}
          />
          {selectedEvent ? <Button label="삭제" onClick={handleDelete} /> : ""}
        </div>
      )}
    </div>
  );
};

export default CalendarInputForm;
