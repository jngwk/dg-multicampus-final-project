import axios from 'axios';

// export const API_SERVER_HOST = 'http://localhost:8282';
// const prefix = `${API_SERVER_HOST}/api/personalTraining`;
const prefix = `/api/personalTraining`; // proxy 사용

export const registerPT = async (PTData) => {
  try {
    const res = await axios.post(`${prefix}/post`, PTData);
    return res.data;
  } catch (error) {
    console.error('Error registering membership:', error);
    throw error;
  }
};

export const getTrainerAndProducts = async (gymId) => {
    try {
      const res = await axios.get(`${prefix}/get/${gymId}`);
      return res.data;
    } catch (error) {
      console.error('Error fetching stats data:', error);
      throw error;
    }
  };
