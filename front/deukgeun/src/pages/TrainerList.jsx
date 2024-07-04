import React, { useState } from "react";
import SignUpTrainerModal from "../components/modals/SignUpTrainerPage"; // Adjust the path as necessary
import Input from "../components/shared/Input";


const initialTrainers = [
    { name: "김종국", email: "Kim@naver.com" }
];

const TrainerList = () => {
    const [trainers, setTrainers] = useState(initialTrainers);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(null);

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };

    const handleSaveEdit = () => {
        setIsEditing(null);
    };


    const handleEditTrainer = (index, key, value) => {
        const updatedTrainers = trainers.map((trainer, i) => 
            i === index ? { ...trainer, [key]: value } : trainer
        );
        setTrainers(updatedTrainers);
    };

    const handleDeleteTrainer = (index) => {
        const updatedTrainers = trainers.filter((_, i) => i !== index);
        setTrainers(updatedTrainers);
    };

    return (
        <div className="flex flex-col items-center space-y-14 my-10">
            <div className="flex flex-row items-center absolute left-64">
                <p className="font-semibold text-xl flex flex-row items-center">
                    <div className="mr-2 text-3xl">🗃️</div> 트레이너 목록</p>
            </div>
            <div className="space-y-4">
                {/* list 헤더 */}
                {/* <div className=" flex justify-between items-center w-[800px] h-10 border-y-2 border-dotted border-peach-fuzz px-10 "> */}
                <div className=" flex justify-between items-center w-[800px] h-10 bg-peach-fuzz bg-opacity-20 rounded-lg px-10 ">
                    <div className="flex flex-row items-center w-2/3">
                        <p className=" text-light-black font-semibold w-1/3">이름</p>
                        <p className="text-light-black font-semibold w-2/3">이메일</p>
                    </div>
                    <div className="flex flex-row items-center font-semibold text-light-black w-1/6">
                        <p className="w-1/2 text-center">수정</p>
                        <p className="w-1/2 text-center">삭제</p>
                    </div>
                </div>


                {/* list 내용 */}
                {trainers.map((trainer, index) => (
                    <div key={index} className="flex justify-between items-center w-[800px] h-16 rounded-lg px-10 bg-light-gray bg-opacity-20 hover:bg-grayish-red hover:bg-opacity-10">
                        <div className="flex flex-row items-center w-2/3">
                            {isEditing === index ? (
                                <>
                                    <Input 
                                        width="100px"
                                        className="text-sm"
                                        value={trainer.name}
                                        onChange={(e) => handleEditTrainer(index, "name", e.target.value)}
                                    />
                                    <Input
        
                                        width="200px"
                                        className="text-sm ml-16"
                                        value={trainer.email}
                                        onChange={(e) => handleEditTrainer(index, "email", e.target.value)}
                                    />
                                </>
                            ) : (
                                <>
                                    <p className="text-sm w-1/3">{trainer.name}</p>
                                    <p className="text-sm w-2/3">{trainer.email}</p>
                                </>
                            )}
                        </div>
                        <div className="flex flex-row items-center text-sm w-1/6">
                            {isEditing === index ? (
                                <button onClick={handleSaveEdit} className="w-1/2">💾</button>
                            ) : (
                                <button onClick={() => setIsEditing(index)} className="w-1/2">✏️</button>
                            )}
                            <button onClick={() => handleDeleteTrainer(index)} className="w-1/2">❌</button>
                        </div>
                    </div>
                ))}

                

                {/* 트레이너 추가 */}
                <button 
                onClick={toggleModal}
                className="font-semibold text-light-black relative float-end w-24 h-10 bg-light-gray bg-opacity-20 rounded-lg hover:bg-peach-fuzz hover:bg-opacity-10">
                    ➕ 추가
                </button>
            </div>

            {isModalVisible && (
                <SignUpTrainerModal
                    toggleModal={toggleModal}
                />
            )}
        </div>

    );
};

export default TrainerList;