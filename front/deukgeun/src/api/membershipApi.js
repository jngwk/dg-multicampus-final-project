import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/membership`;

export const registerMembership = async (membershipData) => {
  try {
    const token = localStorage.getItem('authToken');
    const res = await axios.post(`${prefix}/register`, membershipData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return res.data;
  } catch (error) {
    console.error("Error registering membership:", error);
    throw error;
  }
};

export const getMembershipStats = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const res = await axios.get(`${prefix}/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error fetching stats data:', error);
    throw error;
  }
};