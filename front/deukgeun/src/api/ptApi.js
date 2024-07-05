import axios from "axios";

export const API_SERVER_HOST = 'http://localhost:8282';
const PtPrefix = `${API_SERVER_HOST}/api/personalTraining`;
const PtSessionPrefix = `${API_SERVER_HOST}/api/ptSession`;
// const PtPrefix = `/api/personalTraining`; // proxy 사용
// const PtSessionPrefix = `/api/ptSession`; // proxy 사용

export const registerPT = async (PTData) => {
  try {
    const res = await axios.post(`${PtPrefix}/post`, PTData);
    return res.data;
  } catch (error) {
    console.error("Error registering membership:", error);
    throw error;
  }
};

export const findPT = async (id = null) => {
  try {
    const res = await axios.get(`${PtPrefix}/findPT`, {
      params: { clientId: id },
    });
    return res.data;
  } catch (error) {
    console.error("Error findPT data:", error);
    throw error;
  }
};

export const registerPTSession = async (ptSessionData) => {
  try {
    const res = await axios.post(`${PtSessionPrefix}/post`, ptSessionData);
    return res.data;
  } catch (error) {
    console.error("Error registering PT session:", error);
    throw error;
  }
};

export const getPTSessions = async (startDate, endDate) => {
  try {
    const res = await axios.get(
      `${PtSessionPrefix}/get/${startDate}/${endDate}`
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching PT sessions:", error);
    throw error;
  }
};

export const updatePTSession = async (ptSessionId, ptSessionData) => {
  try {
    const res = await axios.put(
      `${PtSessionPrefix}/put/${ptSessionId}`,
      ptSessionData
    );
    return res.data;
  } catch (error) {
    console.error("Error updating PT session:", error);
    throw error;
  }
};

export const deletePTSession = async (ptSessionId) => {
  try {
    const res = await axios.delete(`${PtSessionPrefix}/delete/${ptSessionId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting PT session:", error);
    throw error;
  }
};

export const getPtSession = async () => {
  try {
    const res = await axios.get(`${PtSessionPrefix}/getPtSession`);
    return res.data;
  } catch (error) {
    console.error("Error findPT data:", error);
    throw error;
  }
};

export const getUsersList = async () => {
  try {
    const res = await axios.get(`${PtPrefix}/getUsersList`);
    return res.data;
  } catch (error) {
    console.error("Error getting user list in pt API", error);
    throw error;
  }
};
