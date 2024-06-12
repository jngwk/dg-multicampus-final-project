import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/workoutSession`;
// const prefix = `/api/workoutSession`; // proxy 사용

export const registerWorkoutSession = async (userId, event) => {
  try {
    const token = localStorage.getItem('authToken');
    const res = await axios.post(`${prefix}/register`, {
      userId,
      workoutDate: event.workoutDate,
      content: event.content,
      bodyWeight: event.bodyWeight,
      memo: event.memo,
      startTime: event.startTime,
      endTime: event.endTime,
      workouts: event.workouts,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;

  } catch (error) {
    throw new Error("Register workout session failed...");
  }
};

export const modifyWorkoutSession = async (userId, event, eventId) => {
  try {
    const token = localStorage.getItem('authToken');
    const res = await axios.put(`${prefix}/modify/${eventId}`, {
      workoutSessionId: eventId,
      userId: userId,
      workoutDate: event.workoutDate,
      content: event.content,
      bodyWeight: event.bodyWeight,
      memo: event.memo,
      startTime: event.startTime,
      endTime: event.endTime,
      workouts: event.workouts,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;

  } catch (error) {
    throw new Error("Modify workout session failed...");
  }
};

export const deleteWorkoutSession = async (eventId) => {
  try {
    const token = localStorage.getItem('authToken');
    const res = await axios.delete(`${prefix}/delete/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
    
  } catch (error) {
    throw new Error("Delete workout session failed...");
  }
};

export const getWorkoutSessions = async (startDate, endDate, userId) => {
  try {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(
      `${prefix}/get/${startDate}/${endDate}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    return res.data;
    
  } catch (error) {
    throw new Error("Get workout sessions failed...");
  }
};