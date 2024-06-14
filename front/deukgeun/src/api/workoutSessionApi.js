import axiosInstance from "./axiosInstance";

// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api/workoutSession`;
const prefix = `/api/workoutSession`; // proxy 사용

export const registerWorkoutSession = async (event) => {
  try {
    const res = await axiosInstance.post(`${prefix}/register`, {
      workoutDate: event.workoutDate,
      content: event.content,
      bodyWeight: event.bodyWeight,
      memo: event.memo,
      startTime: event.startTime,
      endTime: event.endTime,
      workouts: event.workouts,
    });
    return res.data;
  } catch (error) {
    throw new Error("Register workout session failed...");
  }
};

export const modifyWorkoutSession = async (event, eventId) => {
  try {
    const res = await axiosInstance.put(`${prefix}/modify/${eventId}`, {
      workoutSessionId: eventId,
      workoutDate: event.workoutDate,
      content: event.content,
      bodyWeight: event.bodyWeight,
      memo: event.memo,
      startTime: event.startTime,
      endTime: event.endTime,
      workouts: event.workouts,
    });
    return res.data;
  } catch (error) {
    throw new Error("Modify workout session failed...");
  }
};

export const deleteWorkoutSession = async (eventId) => {
  try {
    const res = await axiosInstance.delete(`${prefix}/delete/${eventId}`);
    return res.data;
  } catch (error) {
    throw new Error("Delete workout session failed...");
  }
};

export const getWorkoutSessions = async (startDate, endDate) => {
  try {
    const res = await axiosInstance.get(
      `${prefix}/get/${startDate}/${endDate}`
    );
    return res.data;
  } catch (error) {
    throw new Error("Get workout sessions failed...");
  }
};
