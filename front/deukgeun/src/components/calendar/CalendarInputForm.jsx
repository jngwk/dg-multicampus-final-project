import React, { useState, useEffect } from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";

const CalendarInputForm = ({ addEvent, selectedDate }) => {
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

  // 날짜 선택시 폼에 반영
  useEffect(() => {
    setFormValues({
      ...formValues,
      date: selectedDate,
    });
  }, [selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues, // 기존 state 가져오기
      [name]: value, // state에서 name과 일치하는 value 수정
    });
  };

  const handleClick = () => {
    console.log("Form values : ", formValues);
    addEvent(formValues);
  };

  return (
    <div className="xl:absolute xl:left-3/4 xl:top-56">
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
        value={formValues.startTime}
        onChange={handleChange}
      />
      <Input
        label="종료 시간"
        name="endTime"
        type="time"
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
      <Button label="작성" onClick={handleClick} />
    </div>
  );
};

export default CalendarInputForm;
