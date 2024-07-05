import axios from "axios";
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
  console.log("@@@@@@@@@@@@@", event);
  try {
    const res = await axios.put(`${prefix}/modify/${eventId}`, {
      workoutSessionId: eventId,
      workoutDate: event.workoutDate,
      content: event.content,
      bodyWeight: event.bodyWeight,
      memo: event.memo,
      startTime: event.startTime,
      endTime: event.endTime,
      workouts: event.workouts,
      ptSession: event.ptSession,
    });
    return res.data;
  } catch (error) {
    throw new Error("Modify workout session failed...");
  }
};

export const deleteWorkoutSession = async (eventId) => {
  try {
    const res = await axios.delete(`${prefix}/delete/${eventId}`);
    return res.data;
  } catch (error) {
    throw new Error("Delete workout session failed...");
  }
};

export const getWorkoutSessions = async (startDate, endDate, trainerId) => {
  try {
    console.log("in get");
    const res = await axios.get(`${prefix}/get/${startDate}/${endDate}`, {
      params: { trainerId: trainerId },
    });
    return res.data;
  } catch (error) {
    throw new Error("Get workout sessions failed...");
  }
};

export const getWorkouts = async (workoutSessionId) => {
  try {
    console.log("WS ID", workoutSessionId);
    const res = await axios.get(`${prefix}/get/workouts/${workoutSessionId}`);
    return res.data;
  } catch (error) {
    throw new Error("Get workouts failed...");
  }
};

export const deleteWorkout = async (workoutId) => {
  try {
    console.log("WO ID", workoutId);
    const res = await axios.delete(`api/workout/delete/${workoutId}`);
    return res.data;
  } catch (error) {
    throw new Error("Get workouts failed...");
  }
};
