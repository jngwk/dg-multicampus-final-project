import axios from "axios";

// export const API_SERVER_HOST = "http://localhost:8282";
// const userPrefix = `${API_SERVER_HOST}/api/user`;
// const gymPrefix = `${API_SERVER_HOST}/api/gym`;
const prefix = `/api/trainer`; //user proxy 사용

export const getTrainerById = async (id) => {
  try {
    const response = await axios.get(`${prefix}/get/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};
