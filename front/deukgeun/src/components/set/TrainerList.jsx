import React from "react";

const TrainerList = ({ trainers }) => {
    return (
        <div className="flex flex-col space-y-4 items-center w-[1000px]">
            {trainers.map((trainer, index) => (
                <div
                    key={index}
                    className="flex flex-row justify-between p-7 mx-6 w-full h-full border-opacity-50 border-b border-grayish-red"
                >
                     <p className="w-[50px] text-center font-semibold">{index + 1}</p>
                    <p className="w-[80px] text-base">{trainer.userName}</p>
                    <p className="w-[600px] text-base">
                        {trainer.trainerCareer}
                    </p>
                    <img
                        src={trainer.trainerImage}
                        alt="Trainer"
                        className="w-36 h-fit object-cover"
                    />
                </div>
            ))}
        </div>
    );
};

export default TrainerList;
