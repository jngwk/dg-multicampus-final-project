import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api`;
// const prefix = `/api`; // proxy 사용

export const login = async (email, password) => {
    try {
      const response = await axios.post(`${prefix}/login`, {
        email,
        password,
      });
  
      return response.data;
    } catch (error) {
      throw new Error("Login failed");
    }
  };