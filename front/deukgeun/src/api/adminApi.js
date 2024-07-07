import axios from "axios";
import axiosInstance from "./axiosInstance";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/admin`;
// const prefix = `/api/admin`; // proxy 사용


export const usersList = async (page = 1, size= 10) => {
    try {
      const res = await axiosInstance.get(`${prefix}/users`,
        {params: {
          page,
          size
        }}
      );
      console.log(res.data);
      return res.data;
  
    } catch (error) {
      console.error("Error fetching user info:", error);
      throw error;
    }
  };