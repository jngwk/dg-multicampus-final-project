import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/user`;
// const prefix = `/api/user`; // proxy 사용

export const userInfo = async () => {
  
  // console.log(token);
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.get(`${prefix}/userInfo`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log(token);
    return response.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};