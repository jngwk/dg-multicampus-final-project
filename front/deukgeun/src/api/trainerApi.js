import axios from "axios";

// export const API_SERVER_HOST = "http://localhost:8282";
// const prefix = `${API_SERVER_HOST}/api/trainer`;
const prefix = `/api/trainer`; // user proxy 사용

export const getTrainerById = async (userId) => {
  try {
    const response = await axios.get(`${prefix}/get/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch trainer by ID");
  }
};

export const getTrainerInfo = async (userId) => {
  try {
    const response = await axios.get(`${prefix}/getTrainerInfo/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch trainer info");
  }
};

//헬스장에서 트레이너 정보 수정할때 필요
export const updateTrainerUserDetails = async (trainerId, userName, email) => {
  try {
    const response = await axios.put(
      `${prefix}/updateUserDetails/${trainerId}`,
      { userName, email }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update trainer user details");
  }
};

export const deleteTrainer = async (trainerId) => {
  try {
    const response = await axios.delete(`${prefix}/delete/${trainerId}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete trainer");
  }
};

//트레이너 본인이 상세 정보 추가할 때
export const updateTrainerInfo = async (trainerData, trainerImageFile, removeImage) => {
  try {
    console.log("Updating trainer info with data:", trainerData);
    console.log("Trainer image file:", trainerImageFile);
    console.log("Remove image:", removeImage);

    const formData = new FormData();
    formData.append("trainerDTO", new Blob([JSON.stringify(trainerData)], { type: "application/json" }));

    if (trainerImageFile) {
      formData.append("trainerImage", trainerImageFile);
    }

    formData.append("removeImage", removeImage);

    const response = await axios.put(`${prefix}/update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    console.log("Received response for updateTrainerInfo:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in updateTrainerInfo:", error);
    throw new Error("Failed to update trainer information");
  }
};
