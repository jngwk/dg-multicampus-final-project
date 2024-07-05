import axios from "axios";

// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api/gym`;
const prefix = `/api/gym`; // proxy 사용

export const getGymList = async () => {
  try {
    const res = await axios.get(`${prefix}/getList`);
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};

export const searchGyms = async (searchWord, filter, location, page, size) => {
  try {
    console.log(searchWord);
    const res = await axios.get(`${prefix}/search`, {
      params: {
        searchWord: searchWord,
        filter: filter,
        location: location,
        page: page,
        size: size,
      },
    });
    console.log("searchGyms", res);
    return res.data;
  } catch (error) {
    console.error("Error in searchGyms", error);
    throw error;
  }
};

export const GymInfo = async (gymId) => {
  try {
    console.log(gymId);
    const res = await axios.get(`${prefix}/get/${gymId}`);
    console.log("GymInfo", res);
    return res.data;
  } catch (error) {
    console.error("Error in GymInfo", error);
    throw error;
  }
};

export const GymInfoByUserId = async () => {
  try {
    const res = await axios.get(`${prefix}/getGymByUserId`);
    console.log("GymInfo", res);
    return res.data;
  } catch (error) {
    console.error("Error in GymInfo", error);
    throw error;
  }
};

export const getProductList = async (gymId) => {
  try {
    const res = await axios.get(`${prefix}/products/${gymId}`);
    console.log("products", res);
    return res.data;
  } catch (error) {
    console.error("Error in GymInfo", error);
    throw error;
  }
};

export const getTrainerList = async (gymId) => {
  try {
    const res = await axios.get(`${prefix}/trainers/${gymId}`);
    console.log("trainers", res);
    return res.data;
  } catch (error) {
    console.error("Error in GymInfo", error);
    throw error;
  }
};

export const updateGym = async (gymId, gymData) => {
  try {
    const res = await axios.put(`${prefix}/put/${gymId}`, gymData);
    console.log(`${prefix}/put/${gymId}`);
    console.log("updateGym", res);
    return res.data;
  } catch (error) {
    console.error("Error in updateGym", error);
    throw error;
  }
};

export const insertImage = async (gymId, formData) => {
  try {
    const response = await axios.post(
      `${prefix}/insertImage/${gymId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to insert image");
  }
};

export const deleteImage = async (gymImage) => {
  try {
    const response = await axios.delete(`${prefix}/deleteImage/${gymImage}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete image");
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(`${prefix}/deleteProduct/${productId}`);
    console.log("deleteProduct", response);
    return response.data;
  } catch (error) {
    console.error("Error in deleteProduct", error);
    throw error;
  }
};
