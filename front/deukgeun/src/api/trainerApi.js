import axios from "axios";

// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api/trainer`;
const prefix = `/api/trainer`; // user proxy 사용

export const getTrainerById = async (userId) => {
  try {
    const response = await axios.get(`${prefix}/get/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const getTrainerInfo = async (userId) => {
  try {
    const response = await axios.get(`${prefix}/getTrainerInfo/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const updateTrainerUserDetails = async (trainerId, userName, email) => {
  try {
    const response = await axios.put(
      `${prefix}/updateUserDetails/${trainerId}`,
      { userName, email }
    );
    return response.data;
  } catch (error) {
    throw new Error("Update failed");
  }
};

export const deleteTrainer = async (trainerId) => {
  try {
    const response = await axios.delete(`${prefix}/delete/${trainerId}`);
    return response.data;
  } catch (error) {
    throw new Error("Delete failed");
  }
};
