import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true, // Include cookies with each request
});

export default axiosInstance;
