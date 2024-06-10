import axios from "axios";

// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api/user`;
const prefix = `/api/user`; // proxy 사용

export const signUpGeneral = async (userData) => {
  try {
    const response = await axios.post(`${prefix}/signUp/general`, {
      userData,
    });

    return response.data;
  } catch (error) {
    throw new Error("Login failed");
  }
};

export const signUpGym = async (userData) => {
  try {
    const response = await axios.post(`${prefix}/signUp/gym`, {
      userData,
    });

    return response.data;
  } catch (error) {
    throw new Error("Login failed");
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
