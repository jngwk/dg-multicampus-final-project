import axios from "axios";
import axiosInstance from "./axiosInstance";

// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api/user`;
const prefix = `/api/user`; // proxy 사용

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${prefix}/login`, {
      email,
      password,
    });

    const { token } = response.data;
    return token;
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};

export const logout = async () => {
  try {
    const response = await axiosInstance.post(`${prefix}/logout`);
    return response;
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};
