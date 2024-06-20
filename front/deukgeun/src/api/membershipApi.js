import axios from 'axios';

// export const API_SERVER_HOST = 'http://localhost:8282';
// const prefix = `${API_SERVER_HOST}/api/membership`;
const prefix = `/api/membership`; // proxy 사용

export const registerMembership = async (membershipData) => {
  try {
    const res = await axios.post(`${prefix}/register`, membershipData);
    return res.data;
  } catch (error) {
    console.error('Error registering membership:', error);
    throw error;
  }
};

export const getMembershipStats = async () => {
  try {
    const res = await axios.get(`${prefix}/stats`);
    return res.data;
  } catch (error) {
    console.error('Error fetching stats data:', error);
    throw error;
  }
};