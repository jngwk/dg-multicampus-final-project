import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/membership`;
// const prefix = `/api`; // proxy 사용

export const getMembershipStats = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(`${prefix}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;

  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
};