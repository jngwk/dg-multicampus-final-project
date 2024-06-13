import axios from "axios";

const prefix = `/api/admin`; // proxy 사용


export const usersInfo = async () => {
  
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get((`${prefix}/users`).data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(token);
      return res.data;
  
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  };