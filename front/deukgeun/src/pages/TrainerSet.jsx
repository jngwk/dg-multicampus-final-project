import React, { useState, useRef, useEffect } from "react";
import { BiSolidImageAdd } from "react-icons/bi";
import useValidation from "../hooks/useValidation";
import Input from "../components/shared/Input";
import TextArea from "../components/shared/TextArea";
import Button from "../components/shared/Button";
import TrainerList from "../components/set/TrainerList";
import { useLocation } from "react-router-dom";

// 트레이너정보
const initTrainerData = {
  userName: "", // 트레이너 이름
  trainerCareer: "", // 트레이너 경력
  trainerImage: "", // 트레이너 이미지
  gymId: "", // 트레이너 ID
};

const TrainerSet = () => {
  const location = useLocation();
  const [trainerData, setTrainerData] = useState(initTrainerData);
  const [imagePreview, setImagePreview] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const { validateInput } = useValidation();
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (location.state) {
      console.log("setTrainerData");
      setTrainerData(location.state.trainer);
    }
  }, []);

  const handleTrainerDataChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "trainerImage" && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
        setTrainerData({
          ...trainerData,
          [name]: reader.result,
        });
      };

      reader.readAsDataURL(file);
    } else {
      setTrainerData({
        ...trainerData,
        [name]: value,
      });
    }

    validateInput(name, value);
  };

  const handleAddTrainer = () => {
    setTrainers([...trainers, trainerData]);
    setImagePreview(null);
    setTrainerData(initTrainerData);
  };

  return (
    <>
      <div className="space-y-8 relative flex flex-col items-center justify-center my-10">
        <div className="flex flex-col space-y-6 relative">
          <p className="font-extrabold text-2xl pb-4 flex flex-row items-center">
            <box-icon name="cog" size="40px" color="#9f8d8d"></box-icon>
            트레이너 정보 설정
          </p>
          <div className="py-10 px-7 mx-6 rounded-lg flex flex-col space-y-4 w-[1000px] h-fit border border-peach-fuzz">
            {/* 트레이너 이름 */}
            <div className="flex flex-row space-x-32">
              <p className="mt-3">트레이너 이름</p>
              <Input
                label="트레이너 이름"
                width="320px"
                name="userName"
                value={trainerData.userName}
                required={true}
                onChange={handleTrainerDataChange}
              ></Input>
            </div>

            {/* 트레이너 경력 */}
            <div className="flex flex-row space-x-32">
              <p className="mt-3">트레이너 경력</p>
              <TextArea
                label="트레이너 경력"
                width="500px"
                name="trainerCareer"
                value={trainerData.trainerCareer}
                required={true}
                onChange={handleTrainerDataChange}
              ></TextArea>
            </div>

            {/* 트레이너 사진 */}
            <div className="flex flex-row space-x-32">
              <p className="mt-3">트레이너 사진</p>
              <div className="flex flex-row ">
                <button
                  className="flex flex-row text-sm my-4 mr-12"
                  type="button"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                >
                  <BiSolidImageAdd size="24" color="#9F8D8D" /> 이미지 추가
                </button>
                <input
                  className="hidden"
                  type="file"
                  name="trainerImage"
                  ref={fileInputRef}
                  onChange={handleTrainerDataChange}
                />
                {/* 트레이너 사진 미리보기 */}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Trainer Preview"
                    className="rounded-lg w-80 h-fit object-cover"
                  />
                )}
              </div>
            </div>

            <div className="absolute right-20 bottom-10">
              <div className="ml-3">
                <Button
                  width="120px"
                  color="peach-fuzz"
                  label="추가"
                  onClick={handleAddTrainer}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Trainer List */}
        <TrainerList trainers={trainers} />

        <div>
          <Button width="120px" color="peach-fuzz" label="정보등록" />
        </div>
      </div>
    </>
  );
};

export default TrainerSet;
