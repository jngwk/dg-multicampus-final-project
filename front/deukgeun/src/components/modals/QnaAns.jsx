import React from "react";
import ModalLayout from "./ModalLayout";
import TextArea from "../shared/TextArea";
import Button from "../shared/Button";


const QnaAns = ({toggleModal}) => {
    return (
        <ModalLayout toggleModal={toggleModal}>
            <div className="flex flex-col items-center">
                <p className="text-center font-semibold text-xl mb-3 text-grayish-red">📧 답변작성하기 📧</p>
                <TextArea
                label="답변을 작성해주세요">
                </TextArea>
                <Button
                label="전송"
                width="150px"
                className="text-white mt-3">
                </Button>
            </div>
        </ModalLayout>
    );
};


export default QnaAns;