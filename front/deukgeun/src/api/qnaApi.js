import axios from "axios";
// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api`;
const prefix = `/api/qna`; // proxy 사용

export const registerInquery = async (formValues) => {
  try {
    const res = await axios.post(`${prefix}/register`, formValues);
    return res.data;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    throw error;
  }
};
