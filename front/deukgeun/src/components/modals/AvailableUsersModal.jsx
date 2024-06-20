import React from "react";
import ModalLayout from "./ModalLayout";
import Loader from "../shared/Loader";

const AvailableUsersModal = ({
  availableUsersLoading,
  availableUsers,
  userData,
  toggleModal,
  handleButtonClick,
}) => {
  return (
    <ModalLayout toggleModal={toggleModal}>
      <div>
        {availableUsersLoading ? (
          <Loader />
        ) : availableUsers.length > 0 ? (
          availableUsers.map(
            (user, index) =>
              user.userId !== userData.userId && (
                <div
                  className="cursor-pointer"
                  key={index}
                  onClick={() => handleButtonClick(user.userId)}
                >
                  <b>{user.userName}</b>
                </div>
              )
          )
        ) : (
          "대화 가능한 상대가 없습니다. \n 헬스장 조회를 통해 대화를 시작하거나 PT 등록을 해주세요."
        )}
      </div>
    </ModalLayout>
  );
};

export default AvailableUsersModal;
