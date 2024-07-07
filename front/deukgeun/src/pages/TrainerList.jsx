import React, { useState, useEffect } from "react";
import SignUpTrainerModal from "../components/modals/SignUpTrainerPage";
import Input from "../components/shared/Input";
import AlertModal from "../components/modals/AlertModal";
import DeleteConfirmModal from "../components/modals/DeleteConfirmModal";
import { getTrainerInfo, updateTrainerUserDetails, deleteTrainer } from "../api/trainerApi";
import { useAuth } from "../context/AuthContext";

const TrainerList = () => {
  const { userData } = useAuth();
  const userId = userData?.userId;
  const [trainers, setTrainers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchTrainerInfo(userId);
    }
  }, [userId]);

  const fetchTrainerInfo = async (userId) => {
    try {
      setIsLoading(true);
      const response = await getTrainerInfo(userId);
      if (response && response.data) {
        setTrainers(response.data);
      } else {
        setTrainers([]);
      }
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleSaveEdit = async (index) => {
    try {
      const { trainerId, userName, email } = trainers[index];
      await updateTrainerUserDetails(trainerId, userName, email);
      fetchTrainerInfo(userId);
      setIsEditing(null);
      setAlertMessage("트레이너 정보가 성공적으로 수정되었습니다!");
      setIsAlertModalVisible(true);
    } catch (error) {
      console.error("Error updating trainer user details:", error.message);
      setAlertMessage("트레이너 정보 수정에 실패했습니다.");
      setIsAlertModalVisible(true);
    }
  };

  const handleEditTrainer = (index, key, value) => {
    const updatedTrainers = trainers.map((trainer, i) =>
      i === index ? { ...trainer, [key]: value } : trainer
    );
    setTrainers(updatedTrainers);
  };

  const handleDeleteClick = (index) => {
    setTrainerToDelete(index);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (trainerToDelete !== null) {
      try {
        const trainerId = trainers[trainerToDelete].trainerId;
        await deleteTrainer(trainerId);
        fetchTrainerInfo(userId);
        setAlertMessage("트레이너가 성공적으로 삭제되었습니다!");
        setIsAlertModalVisible(true);
      } catch (error) {
        console.error("Error deleting trainer:", error.message);
        setAlertMessage("트레이너 삭제에 실패했습니다.");
        setIsAlertModalVisible(true);
      }
    }
    setIsDeleteModalVisible(false);
    setTrainerToDelete(null);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setTrainerToDelete(null);
  };

  const handleTrainerAdded = () => {
    fetchTrainerInfo(userId);
    toggleModal();
  };

  const handleAlertConfirm = () => {
    setIsAlertModalVisible(false);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col items-center space-y-14 my-10">
      <div className="flex flex-row items-center absolute left-64">
        <p className="font-semibold text-xl flex flex-row items-center">
          <div className="mr-2 text-3xl">🗃️</div> 트레이너 목록
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center w-[800px] h-10 bg-peach-fuzz bg-opacity-20 rounded-lg px-10 ">
          <div className="flex flex-row items-center w-2/3">
            <p className="text-light-black font-semibold w-1/3">이름</p>
            <p className="text-light-black font-semibold w-2/3">이메일</p>
          </div>
          <div className="flex flex-row items-center font-semibold text-light-black w-1/6">
            <p className="w-1/2 text-center">수정</p>
            <p className="w-1/2 text-center">삭제</p>
          </div>
        </div>

        {Array.isArray(trainers) && trainers.length > 0 ? (
          trainers.map((trainer, index) => (
            <div
              key={index}
              className="flex justify-between items-center w-[800px] h-16 rounded-lg px-10 bg-light-gray bg-opacity-20 hover:bg-grayish-red hover:bg-opacity-10"
            >
              <div className="flex flex-row items-center w-2/3">
                {isEditing === index ? (
                  <>
                    <Input
                      width="100px"
                      className="text-sm"
                      value={trainer.userName}
                      onChange={(e) =>
                        handleEditTrainer(index, "userName", e.target.value)
                      }
                    />
                    <Input
                      width="200px"
                      className="text-sm ml-16"
                      value={trainer.email}
                      onChange={(e) =>
                        handleEditTrainer(index, "email", e.target.value)
                      }
                    />
                  </>
                ) : (
                  <>
                    <p className="text-sm w-1/3">{trainer.userName}</p>
                    <p className="text-sm w-2/3">{trainer.email}</p>
                  </>
                )}
              </div>
              <div className="flex flex-row items-center text-sm w-1/6">
                {isEditing === index ? (
                  <button onClick={() => handleSaveEdit(index)} className="w-1/2">
                    💾
                  </button>
                ) : (
                  <button onClick={() => setIsEditing(index)} className="w-1/2">
                    ✏️
                  </button>
                )}
                <button onClick={() => handleDeleteClick(index)} className="w-1/2">
                  ❌
                </button>
              </div>
            </div>
          ))
        ) : (
          ""
        )}

        <button
          onClick={toggleModal}
          className="font-semibold text-light-black relative float-end w-24 h-10 bg-light-gray bg-opacity-20 rounded-lg hover:bg-peach-fuzz hover:bg-opacity-10"
        >
          ➕ 추가
        </button>
      </div>

      {isModalVisible && (
        <SignUpTrainerModal
          toggleModal={toggleModal}
          onTrainerAdded={handleTrainerAdded}
        />
      )}

      {isAlertModalVisible && (
        <AlertModal
          headerEmoji={"✔️"}
          line1={alertMessage}
          button1={{ label: "확인", onClick: handleAlertConfirm }}
        />
      )}

      {isDeleteModalVisible && (
        <DeleteConfirmModal
          onDelete={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default TrainerList;