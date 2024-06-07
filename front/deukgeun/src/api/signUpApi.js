import axios from "axios";
// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api`;
const prefix = `/api`; // proxy 사용

export const signUpGeneral = async (userData) => {
  try {
    const response = await axios.post(`${prefix}/signUp`, {
      userData,
    });

    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const signUpGym = async (userData) => {
  try {
    const response = await axios.post(`${prefix}/gym/signUp`, {
      userData,
    });

    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};
