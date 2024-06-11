import axios from "axios";

export const API_SERVER_HOST = "http://localhost:8282";
const prefix = `${API_SERVER_HOST}/api/user`;
// const prefix = `/api/user`; // proxy 사용

export const signUpGeneral = async (userData) => {
  try {
    const response = await axios.post(`${prefix}/signUp`, userData);

    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const signUpGym = async (userData) => {
  try {
    console.log(userData);
    const response = await axios.post(`/api/gym/signUp`, userData);

    return response.data;
  } catch (error) {
    throw new Error("Signup failed");
  }
};

export const sendVerificationEmail = async (email, code) => {
  try {
    const response = await axios.post(`${prefix}/sendCode`, {
      email: email,
      code: code,
    });
    console.log("response: ", response);
    console.log("Email sent successfully");
    return response;
  } catch (error) {
    console.error("Error sending email", error);
  }
};

export const checkCrNumber = async (crNumber) => {
  try {
    const response = await axios.post(`/api/gym/crNumberCheck`, {
      crNumber: crNumber,
    });
    console.log("response: ", response);
    return response;
  } catch (error) {
    console.error("Error checking crNumber", error);
  }
};
