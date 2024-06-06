import React, { useState, useEffect } from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import useCustomDate from "../../hooks/useCustomDate";

// 캘린더 포맷이랑 일치하게 수정하기
const CalendarInputForm = ({
  addEvent,
  updateEvent,
  deleteEvent,
  selectedDate,
  selectedEvent,
  isInputFormVisible,
  toggleInputForm,
}) => {
  const { computeTime, getTime } = useCustomDate();

  const [formValues, setFormValues] = useState({
    date: "",
    startTime: "",
    endTime: "",
    client: "",
    summary: "",
    workout: "",
    set: "",
    rep: "",
    liftWeight: "",
    bodyWeight: "",
    memo: "",
  });

  // 날짜/이벤트 선택시 폼에 반영
  useEffect(() => {
    if (selectedEvent) {
      setFormValues(selectedEvent.extendedProps);
      console.log("selectedEvent", selectedEvent);
    } else if (selectedDate) {
      const selectedTime = selectedDate.split("T")[1];
      setFormValues({
        date: selectedDate.split("T")[0],
        startTime: selectedTime ? computeTime(selectedTime) : getTime(),
        endTime: selectedTime ? computeTime(selectedTime, 0.5) : getTime(1),
      });
      // console.log("selectedDate: ", selectedDate);
      console.log("selectedTime: ", formValues.startTime);
    }
  }, [selectedDate, selectedEvent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues, // 기존 state 가져오기
      [name]: value, // state에서 name과 일치하는 value 수정
    });
  };

  const handleSubmit = (e) => {
    console.log("handleSubmit");
    selectedEvent ? updateEvent(formValues) : addEvent(formValues);
  };

  const handleDelete = () => {
    console.log("handleDelete");
    deleteEvent();
  };

  return (
    <div className="xl:absolute xl:left-3/4 xl:top-56">
      <span className="hover:cursor-pointer" onClick={toggleInputForm}>
        보이기/숨기기
      </span>
      {isInputFormVisible && (
        <div>
          <Input
            label="날짜"
            name="date"
            type="date"
            value={formValues.date}
            onChange={handleChange}
          />
          <Input
            label="시작 시간"
            name="startTime"
            type="time"
            step="1800"
            value={formValues.startTime}
            onChange={handleChange}
          />
          <Input
            label="종료 시간"
            name="endTime"
            type="time"
            step="1800"
            value={formValues.endTime}
            onChange={handleChange}
          />
          <Input
            label="회원"
            name="client"
            value={formValues.client}
            onChange={handleChange}
          />
          <Input
            label="요약"
            name="summary"
            value={formValues.summary}
            onChange={handleChange}
          />
          <Input
            label="운동"
            name="workout"
            value={formValues.workout}
            onChange={handleChange}
          />
          <Input
            label="SET"
            name="set"
            type="number"
            value={formValues.set}
            onChange={handleChange}
          />
          <Input
            label="REP"
            name="rep"
            type="number"
            value={formValues.rep}
            onChange={handleChange}
          />
          <Input
            label="무게(KG)"
            name="liftWeight"
            type="number"
            value={formValues.liftWeight}
            onChange={handleChange}
          />
          <Input
            label="몸무게(KG)"
            name="bodyWeight"
            type="number"
            value={formValues.bodyWeight}
            onChange={handleChange}
          />
          <Input
            label="메모"
            name="memo"
            value={formValues.memo}
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
