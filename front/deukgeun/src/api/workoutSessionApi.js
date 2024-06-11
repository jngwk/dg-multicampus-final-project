import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/workoutSession`;
// const prefix = `/api/workoutSession`; // proxy 사용

export const registerWorkoutSession = async (userId, event) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`${prefix}/workoutSession/register`, {
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
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error("Register workout session failed...");
  }
};

export const modifyWorkoutSession = async (userId, event, eventId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.put(`${prefix}/workoutSession/modify/${eventId}`, {
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
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error("Modify workout session failed...");
  }
};

export const deleteWorkoutSession = async (eventId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.delete(`${prefix}/workoutSession/delete/${eventId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error("Delete workout session failed...");
  }
};

export const getWorkoutSessions = async (startDate, endDate, userId) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(
      `${prefix}/workoutSession/get/${startDate}/${endDate}/${userId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Get workout sessions failed...");
  }
};