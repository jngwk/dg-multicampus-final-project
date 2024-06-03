import axios from "axios";

const prefix = `/api`; // proxy 사용

export const getChart = async () => {
  try {
    const res = await axios.get(`${prefix}/chart`);
    return res.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
};