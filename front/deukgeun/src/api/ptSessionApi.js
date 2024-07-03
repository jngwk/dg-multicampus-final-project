import axios from "axios";

// export const API_SERVER_HOST = "http://localhost:8282";
<<<<<<< HEAD
// const prefix = `${API_SERVER_HOST}/api/personalTraining`;
const prefix = `/api/personalTraining`; // proxy 사용
=======
// const prefix = `${API_SERVER_HOST}/api/ptSession`;
const prefix = `/api/ptSession`; // proxy 사용
>>>>>>> 0bb1aeec8e0a89af29f6be13a165b6d29500057f

export const registerPTSession = async (workoutSessionData) => {
  try {
    const res = await axios.post(`${prefix}/post`, workoutSessionData);
    return res.data;
  } catch (error) {
    console.error("Error registering pt session and workout session:", error);
    throw error;
  }
};
