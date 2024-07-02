import React, { useState, useEffect } from "react";
import Button from "../shared/Button";
import Input from "../shared/Input";
import useCustomDate from "../../hooks/useCustomDate";
import Loader from "../shared/Loader";
import UserSearchModal from "../modals/UserSearchModal";
import { getUsersList } from "../../api/ptApi";
import { useAuth } from "../../context/AuthContext";

const initFormValues = {
  ptSessionId: "",
  ptUserId: "",
  ptUserName: "",
  trainer: "",
  ptMemo: "",
  workoutDate: "",
  startTime: "",
  endTime: "",
  content: "",
  bodyWeight: "",
  memo: "",
  workouts: [
    { workoutName: "", workoutSet: "", workoutRep: "", workoutWeight: "" },
  ],
};

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
  role,
}) => {
  const { computeTime, getTime } = useCustomDate();
  const { userData } = useAuth();

  // Flattened initial state
  const [formValues, setFormValues] = useState(initFormValues);

  const [deletedWorkouts, setDeletedWorkouts] = useState([]);
  const [date, setDate] = useState();
  const [isUserSearchModalVisible, setIsUserSearchModalVisible] =
    useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // 날짜/이벤트 선택시 폼에 반영
  useEffect(() => {
    setDeletedWorkouts([]);
    if (selectedEvent) {
      setFormValues({
        ptSessionId: selectedEvent.extendedProps.ptSession?.ptSessionId || "",
        ptUserId: selectedEvent.extendedProps.ptSession?.pt?.user?.userId || "",
        ptUserName:
          selectedEvent.extendedProps.ptSession?.pt?.user?.userName || "",
        trainer: selectedEvent.extendedProps.ptSession?.trainer || "",
        ptMemo: selectedEvent.extendedProps.ptSession?.memo || "",
        workoutDate: selectedEvent.extendedProps.workoutDate || "",
        startTime: selectedEvent.extendedProps.startTime || "",
        endTime: selectedEvent.extendedProps.endTime || "",
        content: selectedEvent.extendedProps.content || "",
        bodyWeight: selectedEvent.extendedProps.bodyWeight || "",
        memo: selectedEvent.extendedProps.memo || "",
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

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Workout change handler
  const handleWorkoutChange = (index, e) => {
    const { name, value } = e.target;
    const updatedWorkouts = formValues.workouts.map((workout, i) =>
      i === index ? { ...workout, [name]: value } : workout
    );
    setFormValues({
      ...formValues,
      workouts: updatedWorkouts,
    });
  };

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
    const updatedWorkouts = formValues.workouts.filter((_, i) => i !== index);
    setFormValues({
      ...formValues,
      workouts: updatedWorkouts,
    });
    if (id) {
      setDeletedWorkouts((prev) => [...prev, id]);
    }
  };

  const handleSubmit = () => {
    const nestedFormValues = {
      ptSession: {
        ptSessionId: formValues.ptSessionId,
        pt: {
          user: {
            userId: formValues.ptUserId,
            userName: formValues.ptUserName,
          },
        },
        trainer: formValues.trainer,
        memo: formValues.ptMemo,
      },
      workoutDate: formValues.workoutDate,
      startTime: formValues.startTime,
      endTime: formValues.endTime,
      content: formValues.content,
      bodyWeight: formValues.bodyWeight,
      memo: formValues.memo,
      workouts: formValues.workouts,
    };

    if (selectedEvent) {
      if (deletedWorkouts.length > 0) {
        deleteWorkouts(deletedWorkouts);
      }
      updateEvent(
        nestedFormValues,
        selectedEvent.id || selectedEvent.extendedProps.workoutSessionId
      );
    } else {
      addEvent(nestedFormValues);
    }
  };

  const handleDelete = async () => {
    await deleteEvent(
      selectedEvent.id || selectedEvent.extendedProps.workoutSessionId
    );
    setFormValues(initFormValues);
  };

  const toggleUserSearchModal = () => {
    if (!isUserSearchModalVisible) {
      const fetchUsers = async () => {
        try {
          setUsersLoading(true);
          const userList = await getUsersList();
          setUsers(userList);
        } catch (error) {
          console.error("error fetching users in calendar input form", error);
        } finally {
          setUsersLoading(false);
        }
      };
      fetchUsers();
    }
    setIsUserSearchModalVisible(!isUserSearchModalVisible);
  };

  return (
    <div className="h-4/6 w-72">
      <div className="p-3 flex gap-1 items-end">
        <div
          className={`mb-1 h-4 w-1 ${
            formValues.ptSessionId ? "bg-blue-300" : "bg-green-200"
          }`}
        ></div>
        <div className="text-3xl ">
          {date}
          <span className="text-base ml-1">일</span>
        </div>
      </div>
      <div className="h-[600px] w-80 px-2 overflow-y-auto overflow-x-hidden scrollbar-hide">
        {formValues.ptSessionId && (
          <>
            <Input
              label="헬스장"
              name="gym"
              type="text"
              value={formValues.trainer.gym.user.userName || ""}
              readOnly
            />
            <Input
              label="트레이너"
              name="trainer"
              type="text"
              value={formValues.trainer.user.userName || ""}
              readOnly
            />
          </>
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
        {role === "ROLE_TRAINER" && (
          <>
            <Input
              label="회원 성함"
              name="ptUserName"
              type="text"
              value={formValues.ptUserName || ""}
              onChange={handleChange}
              readOnly
              feature={
                <div className="-translate-y-1">
                  <box-icon name="search" color="#bdbdbd" size="s"></box-icon>
                </div>
              }
              featureOnClick={toggleUserSearchModal}
              featureEnableOnLoad
            />
            {isUserSearchModalVisible && (
              <UserSearchModal
                toggleModal={toggleUserSearchModal}
                userData={userData}
                users={users}
                usersLoading={usersLoading}
                formValues={formValues}
                setFormValues={setFormValues}
              />
            )}
          </>
        )}
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
          label={selectedEvent ? "수정" : "등록"}
          onClick={handleSubmit}
        />
        {selectedEvent && <Button label="삭제" onClick={handleDelete} />}
      </div>
    </div>
  );
};

export default CalendarInputForm;
