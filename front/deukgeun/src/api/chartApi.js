import axios from "axios";
export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api`;
// const prefix = `/api`; // proxy 사용

export const getMembershipStats = async (token) => {
  try {
    const res = await axios.get(`${prefix}/membership/stats`, {
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
