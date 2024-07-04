import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/user`;
// const prefix = `/api/user`; // proxy 사용

export const userInfo = async () => {
  try {
    const res = await axios.get(`${prefix}/userInfo`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const uploadImage = async (formData) => {
  try {
    const res = await axios.post(`${prefix}/uploadImage`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error uploading user image:", error);
    throw error;
  }
};

export const getImage = async () => {
  try {
    const res = await axios.get(`${prefix}/getImage`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching user images:", error);
    throw error;
  }
};

export const getImageById = async (id) => {
  try {
    const res = await axios.get(`${prefix}/getImage/${id}`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching user images:", error);
    throw error;
  }
};

export const deleteImage = async () => {
  try {
    const res = await axios.delete(`${prefix}/deleteImage`);
    return res.data.data;
  } catch (error) {
    console.error("Error fetching user images:", error);
    throw error;
  }
};

export const updateImage = async (formData) => {
  try {
    const res = await axios.put(`${prefix}/updateImage`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error updating user image:", error);
    throw error;
  }
};

export const updateUserInfo = async (userData) => {
  try {
    const res = await axios.put(`${prefix}/update`, userData);
    console.log("API", res);
    return res.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};

export const resetPasswordWithEmail = async (email, password) => {
  try {
    const res = await axios.post(`${prefix}/resetPassword`, {
      email: email,
      password: password,
    });
    console.log("API", res);
    return res.data;
  } catch (error) {
    console.error("Error updating user info:", error);
    throw error;
  }
};
