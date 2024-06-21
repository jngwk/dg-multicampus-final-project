import axios from "axios";
const prefix = `/api/gym`; // proxy 사용

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
