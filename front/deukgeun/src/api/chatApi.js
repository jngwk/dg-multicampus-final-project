import axiosInstance from "./axiosInstance";
import axios from "axios";

// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api`;
const prefix = `/chat`; // proxy 사용

export const getChatHistory = async (chatRoomId) => {
  try {
    const res = await axios.get(`${prefix}/history/${parseInt(chatRoomId)}`);
    console.log("getChatHistory", res);
    return res.data;
  } catch (error) {
    console.error("Error fetching chat data:", error);
    throw error;
  }
};

export const getChatRooms = async () => {
  try {
    const res = await axios.get(`${prefix}/rooms`);
    console.log("getChatRooms", res);
    return res.data;
  } catch (error) {
    console.error("Error fetching chat rooms", error);
    throw error;
  }
};

export const getAvailableUsers = async () => {
  try {
    const res = await axios.get(`${prefix}/availableUsers`);
    console.log("getAvailableUsers", res);
    return res.data;
  } catch (error) {
    console.error("Error fetching chat rooms", error);
    throw error;
  }
};

export const getChatRoom = async (selectedUserId) => {
  try {
    console.log("targetUserId", selectedUserId);
    const res = await axios.post(`${prefix}/findOrCreateChatRoom`, {
      targetUserId: selectedUserId,
    });
    console.log("findOrCreateChatRoom", res);
    return res.data;
  } catch (error) {
    console.error("Error fetching chat rooms", error);
    throw error;
  }
};
