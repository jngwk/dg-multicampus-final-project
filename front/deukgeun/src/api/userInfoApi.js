import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/user`;
// const prefix = `/api/user`; // proxy 사용

export const userInfo = async (token) => {
  try {
    const res = await axios.get(`${prefix}/userInfo`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};
