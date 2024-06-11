import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/user`;
// const prefix = `/api/user`; // proxy 사용

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${prefix}/login`, {
      email,
      password,
    });

    if (response.data.success) {
      const token = response.data.data.token;
      localStorage.setItem('authToken', token);
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw new Error("Login failed: " + error.message);
  }
};
