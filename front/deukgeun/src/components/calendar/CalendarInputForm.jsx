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
  const [date, setDate] = useState();

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
      setDate(selectedEvent.extendedProps.workoutDate.split("-")[2]);
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
      setDate(selectedDate.split("T")[0].split("-")[2]);
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
    <div className="h-4/6 w-72">
      <div className="p-3 flex gap-1 items-end">
        <div
          className={`mb-1 h-4 w-1 ${
            formValues.ptSessionid ? "bg-blue-300" : "bg-peach-fuzz"
          }`}
        ></div>
        <div className="text-3xl ">
          {date}
          <span className="text-base ml-1">일</span>
        </div>
      </div>

      <div className="h-[600px] w-80 px-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {/* TODO PT session과 엮기 */}
        {formValues.ptSessionid && (
          <Input
            label="트레이너"
            name="trainer"
            type="text"
            value={formValues.ptSessionId || ""}
            onChange={handleChange}
            readOnly={true}
          />
        )}
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
        <hr style={{ width: "240px" }} />
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
                <hr style={{ width: "240px" }} />
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
        <hr style={{ width: "240px" }} />
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
    </div>
  );
};

export default CalendarInputForm;
