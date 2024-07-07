import axios from "axios";
import axiosInstance from "./axiosInstance";

// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api/reviews`
const prefix = `/api/reviews`; // proxy 사용

export const addReview = async (reviewData) => {
  const res = await axios.post(`${prefix}/registerReview`, reviewData);
  return res.data;
};

export const uploadReviewImages = async (reviewId, formData) => {
  const res = await axios.post(`${prefix}/uploadImages/${reviewId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteReviewImages = async (reviewId, formData) => {
  const res = await axios.delete(
    `${prefix}/deleteImages/${reviewId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return res.data;
};

export const updateReviewImages = async (reviewId, formData) => {
  const res = await axios.put(`${prefix}/updateImages/${reviewId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const getReviews = async (gymId) => {
  try {
    const res = await axios.get(`${prefix}/reviewList/${gymId}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching reviews for gym ${gymId}:`, error);
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const res = await axios.delete(`${prefix}/delete/${reviewId}`);
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const updateReview = async (reviewData) => {
  try {
    const res = await axios.put(
      `${prefix}/update/${reviewData.id}`,
      reviewData
    );
    return res.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};
export const getAverageRatingByGymId = async (gymId) => {
  try {
    const res = await axios.get(`${prefix}/avgRating/${gymId}`);
    return res.data;
  } catch (error) {
    console.error("Error updating review:", error);
    throw error;
  }
};
