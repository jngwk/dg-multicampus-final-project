//이메일 전송 구현 미완성

import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import TextArea from "../shared/TextArea";
import Button from "../shared/Button";
import { sendVerificationEmail } from "../../api/qnaApi";

const QnaAns = ({ toggleModal, userEmail }) => {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await sendVerificationEmail(userEmail, answer);
      console.log("Response from server:", response);
      setSuccessMessage("이메일이 성공적으로 전송되었습니다.");
    } catch (error) {
      console.error("Error sending response:", error);
      setError("전송에 실패하였습니다. 다시 시도해주세요.");
    }
  };

  return (
    <ModalLayout toggleModal={toggleModal}>
      <div className="flex flex-col items-center">
        <p className="text-center font-semibold text-xl mb-3 text-grayish-red">
          📧 답변작성하기 📧
        </p>
        <TextArea
          label="답변을 작성해주세요"
          value={answer}
          onChange={handleAnswerChange}
        />
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
        <Button
          label="전송"
          width="150px"
          className="text-white mt-3"
          onClick={handleSubmit}
        />
      </div>
    </ModalLayout>
  );
};

export default QnaAns;