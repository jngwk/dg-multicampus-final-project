import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `/api/chart`;

export const getChart = async () => {
  try {
    const res = await axios.get(prefix);
    return res.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
};
