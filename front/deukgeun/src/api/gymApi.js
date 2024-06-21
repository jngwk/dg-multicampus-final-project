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
