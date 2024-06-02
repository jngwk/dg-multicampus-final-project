import axios from "axios";
export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/charts`
const prefix = `/charts`; // proxy 사용

export const fetchData = async () => {
  const res = await axios.get(`${prefix}/data`);
  const response = await fetch("/data");
  const data = await response.json();

  return res.data;
};

export default fetchData;
