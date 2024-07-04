
import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import TextArea from "../shared/TextArea";
import Button from "../shared/Button";

const QnaAns = ({ toggleModal, handleReply}) => {
  const [reply, setReply] = useState("");

  const handleAnswerChange = (e) => {
    setReply(e.target.value);
  };

  const handleSubmit = async () => {
    await handleReply(reply);
    toggleModal();

  };

  return (
    <ModalLayout toggleModal={toggleModal}>
      <div className="flex flex-col items-center">
        <p className="text-center font-semibold text-xl mb-3 text-grayish-red">
          📧 답변작성하기 📧
        </p>
        <TextArea
          label="답변을 작성해주세요"
          value={reply}
          onChange={handleAnswerChange}
        />
        {/* {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>} */}
        <Button
          label="완료"
          width="150px"
          className="text-white mt-3"
          onClick={handleSubmit}
        />
      </div>
    </ModalLayout>
  );
};

export default QnaAns;