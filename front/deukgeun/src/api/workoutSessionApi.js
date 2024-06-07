import axios from "axios";
// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api`;
const prefix = `/api/workoutSession`; // proxy 사용

export const registerWorkoutSession = async (userId, event) => {
  try {
    const response = await axios.post(`${prefix}/register`, {
      userId,
      workoutDate: event.date,
      content: event.content,
      bodyWeight: event.bodyWeight,
      memo: event.memo,
      startTime: event.startTime,
      endTime: event.endTime,
      workouts: event.workouts,
    });
    return response.data;
  } catch (error) {
    throw new Error("Register workout session failed...");
  }
};

export const modifyWorkoutSession = async (userId, event, eventId) => {
  console.log("Updating event: ", event);
  try {
    const response = await axios.put(`${prefix}/modify/${eventId}`, {
      workoutSessionId: eventId,
      userId: userId,
      workoutDate: event.date,
      content: event.content,
      bodyWeight: event.bodyWeight,
      memo: event.memo,
      startTime: event.startTime,
      endTime: event.endTime,
      workouts: event.workouts,
    });
    return response.data;
  } catch (error) {
    throw new Error("Register workout session failed...");
  }
};

export const deleteWorkoutSession = async (eventId) => {
  try {
    const response = await axios.delete(`${prefix}/delete/${eventId}`);
    return response.data;
  } catch (error) {
    throw new Error("Delete workout session failed...");
  }
};

export const getWorkoutSessions = async (startDate, endDate, userId) => {
  try {
    const response = await axios.get(
      `${prefix}/get/${startDate}/${endDate}/${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Get workout sessions failed...");
  }
};
