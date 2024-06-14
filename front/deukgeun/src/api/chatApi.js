import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/chat`;
// const prefix = `/chat`; // proxy 사용

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

export const getChatRooms = async (userId) => {
  try {
    const res = await axios.get(`${prefix}/rooms/${parseInt(userId)}`);
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

export const getChatRoom = async (userId1, userId2) => {
  try {
    const res = await axios.post(`${prefix}/findOrCreateChatRoom`, [
      userId1,
      userId2,
    ]);
    console.log("findOrCreateChatRoom", res);
    return res.data;
    
  } catch (error) {
    console.error("Error fetching chat rooms", error);
    throw error;
  }
};
