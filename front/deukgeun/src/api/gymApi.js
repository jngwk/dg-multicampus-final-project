import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/gym`;
// const prefix = `/api/gym`; // proxy 사용

export const getGymList = async () => {
  try {
    const res = await axios.get(`${prefix}/getList`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const searchGyms = async (searchWord) => {
  try {
    console.log(searchWord);
    const res = await axios.get(`${prefix}/search/${searchWord}`);
    console.log("searchGyms", res);
    return res.data;
  } catch (error) {
    console.error("Error in searchGyms", error);
    throw error;
  }
};

export const GymInfo = async (gymId) => {
  try {
    console.log(gymId);
    const res = await axios.get(`${prefix}/get/${gymId}`);
    console.log("GymInfo", res);
    return res.data;
  } catch (error) {
    console.error("Error in GymInfo", error);
    throw error;
  }
};

export const updateGym = async (gymId, gymData) => {
  try {
    const res = await axios.put(`${prefix}/put/${gymId}`, gymData);
    console.log(`${prefix}/put/${gymId}`);
    console.log("updateGym", res);
    return res.data;
  } catch (error) {
    console.error("Error in updateGym", error);
    throw error;
  }
};

