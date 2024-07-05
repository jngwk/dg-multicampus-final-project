import React, { useState } from "react";
import axios from "axios";

const TrainerUpdateForm = () => {
  const [trainerDTO, setTrainerDTO] = useState({
    trainerId: "", // 트레이너 ID
    trainerCareer: "",
    trainerAbout: "",
    trainerImage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerDTO({ ...trainerDTO, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // PUT 요청을 보낼 API 엔드포인트 설정
    const url = `http://localhost:8282/api/trainer/update/${trainerDTO.trainerId}`;

    // Axios를 사용하여 PUT 요청 보내기
    axios
      .put(url, trainerDTO)
      .then((response) => {
        console.log("Trainer updated successfully:", response.data);
        // 성공적으로 업데이트된 경우에 대한 처리
        alert("Trainer updated successfully!");
      })
      .catch((error) => {
        console.error("Failed to update trainer:", error);
        // 실패한 경우에 대한 처리
        alert("Failed to update trainer.");
      });
  };

  return (
    <div>
      <h2>Update Trainer Information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Trainer ID:
          <input
            type="number"
            name="trainerId"
            value={trainerDTO.trainerId}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Career:
          <input
            type="text"
            name="trainerCareer"
            value={trainerDTO.trainerCareer}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          About:
          <textarea
            name="trainerAbout"
            value={trainerDTO.trainerAbout}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Image URL:
          <input
            type="text"
            name="trainerImage"
            value={trainerDTO.trainerImage}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Update Trainer</button>
      </form>
    </div>
  );
};

export default TrainerUpdateForm;
