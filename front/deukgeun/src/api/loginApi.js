import axios from "axios";
<<<<<<< HEAD
import axiosInstance from "./axiosInstance";

// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api/user`;
const prefix = `/api/user`; // proxy 사용
=======
export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api`;
const prefix = `/api`; // proxy 사용
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12

export const login = async (email, password) => {
  try {
    const response = await axiosInstance.post(`${prefix}/login`, {
      email,
      password,
    });

    const { token } = response.data;
    return token;
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};
<<<<<<< HEAD

export const logout = async () => {
  try {
    const response = await axiosInstance.post(`${prefix}/logout`);
    return response;
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};
=======
>>>>>>> 60c7921400a822dc5e01e98e4e5368d3a2a03d12
