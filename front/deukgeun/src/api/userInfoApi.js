import axios from "axios";

// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api/user`;
const prefix = `/api/user`; // proxy 사용

export const userInfo = async () => {
  
  try {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(`${prefix}/userInfo`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;

  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};