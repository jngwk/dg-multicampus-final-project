import React, { useState } from "react";
import useChat from "../../hooks/useChat";
import ModalLayout from "./ModalLayout";
import TextArea from "../shared/TextArea";
import Button from "../shared/Button";
import AlertModal from "./AlertModal";

const ChatModal = ({ toggleModal, selectedGym }) => {
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const { chatMessage, setChatMessage, sendMessageHttp, findOrCreateChatRoom } =
    useChat();

  const handleSendButton = async () => {
    // 채팅 메시지 보내기
    try {
      const newChatRoom = await findOrCreateChatRoom(selectedGym.user.userId);
      console.log("newChatRoom", newChatRoom);
      if (newChatRoom) {
        const res = await sendMessageHttp(newChatRoom);
        console.log("sendMessageHttp res", res);
      }
      setIsAlertModalVisible(true);
    } catch (error) {
      console.error("error sending contact message", error);
    }
  };

  const handleAlertModalButton = () => {
    setIsAlertModalVisible(false);
    toggleModal();
  };

  return (
    <>
      <ModalLayout toggleModal={toggleModal}>
        <div className="flex flex-col justify-center items-start gap-4">
          <div className="mb-2">
            <span className="text-3xl">헬스장 문의 🙋</span>
          </div>
          <div className=" flex flex-col justify-center text-lg gap-2">
            <span>💪 {selectedGym.user.userName}</span>
            <p className="before:content-['*'] before:text-red-500 text-sm text-gray-500">
              문의하신 내용 및 답변은 '대화방'에서 확인하실 수 있습니다
            </p>
            <TextArea
              label={"문의내용"}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
            />
          </div>
          <div className="flex justify-end items-center w-full">
            <Button
              label={"문의하기"}
              color="bright-orange"
              width="100px"
              height="50px"
              onClick={handleSendButton}
            />
          </div>
        </div>
      </ModalLayout>
      {isAlertModalVisible && (
        <AlertModal
          headerEmoji={"✅"}
          line1={"메시지 전송이 완료됐습니다!"}
          line2={"답변은 '대화방'에서 확인해주세요"}
          button1={{ label: "확인", onClick: handleAlertModalButton }}
          button2={{ label: "대화방", path: "/chat" }}
        />
      )}
    </>
  );
};

export default ChatModal;
