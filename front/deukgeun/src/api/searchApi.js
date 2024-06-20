import axios from 'axios';

export const API_SERVER_HOST = 'http://localhost:8282';
const prefix = `${API_SERVER_HOST}/api`;

export const searchGyms = async (keyword) => {
  try {
    const res = await axios.get(`${prefix}/search`, { params: { keyword } });
    return res.data;
  } catch (error) {
    console.error('Error searching gyms:', error);
    throw error;
  }
};
