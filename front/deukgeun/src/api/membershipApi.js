import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/user`;
// const prefix = `/api/user`; // proxy 사용

export const registerMembership = async (membershipData) => {
  try {
    const token = localStorage.getItem('authToken');
    const response = await axios.post(`${prefix}/user/registerMembership`, membershipData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error registering membership:", error);
    throw error;
  }
};