import React from "react";
import ModalLayout from "./ModalLayout";
import Button from "../shared/Button";

const DeleteConfirmModal = ({ onDelete, onCancel }) => {
  return (
    <ModalLayout>
      <div className="flex flex-col justify-center items-center gap-9 md:gap-6">
        <div>
          <span className="text-5xl">⚠️</span>
        </div>
        <div className="text-center flex flex-col justify-center gap-4 md:py-8 md:px-8 text-lg">
          <span className="font-bold">정말 삭제하시겠습니까?</span>
          <span className="text-sm text-gray-600">
            이 작업은 되돌릴 수 없습니다.
          </span>
        </div>
        <div className="flex gap-6">
          <Button
            label="삭제"
            onClick={onDelete}
            width="100px"
            height="40px"
            color="bright-orange"
          />
          <Button
            label="취소"
            onClick={onCancel}
            width="100px"
            height="40px"
            color="gray"
          />
        </div>
      </div>
    </ModalLayout>
  );
};

export default DeleteConfirmModal;
