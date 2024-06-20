//리뷰작성 모달창

import React, { useState } from "react";
import ModalLayout from "./ModalLayout";
import TextArea from "../shared/TextArea";
import { IoMdPhotos } from "react-icons/io";
import Button from "../shared/Button";

const initState = {
  comment: "",
  reviewImg: "",
};

const ReviewModal = ({ toggleModal }) => {
  const [formValues, setFormValues] = useState(initState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormValues({
      ...formValues,
      reviewImg: file,
    });
  };

  return (
    <ModalLayout toggleModal={toggleModal}>
      <div className="flex flex-col h-96">
        <div className="flex flex-col gap-1 justify-center items-center">
          <div className="mb-2 font-semibold text-xl">
            리뷰작성
            <div className="mt-2 w-16 border-b-2 border-grayish-red border-opacity-20"></div>
          </div>
          <TextArea
            label="후기를 작성해주세요."
            required={true}
            name="comment"
            value={formValues.comment}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="flex text-sm items-center cursor-pointer">
            <IoMdPhotos className="w-7 h-7 pr-1" />
            파일 이미지 넣기
            <input
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <Button label="작성" width="100px" className={`float-right mt-2`} />
        </div>
      </div>
    </ModalLayout>
  );
};

export default ReviewModal;
