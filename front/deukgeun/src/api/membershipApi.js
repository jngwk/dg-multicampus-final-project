import axios from "axios";
export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api`;

export const registerMembership = async (membershipData, token) => {
  try {
    const response = await axios.post(`${prefix}/registerMembership`, membershipData, {
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
