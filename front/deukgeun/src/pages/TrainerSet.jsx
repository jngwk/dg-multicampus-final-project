import React, { useState, useRef, useEffect } from "react";
import { BiSolidImageAdd } from "react-icons/bi";
import useValidation from "../hooks/useValidation";
import Input from "../components/shared/Input";
import TextArea from "../components/shared/TextArea";
import Button from "../components/shared/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaTimes } from "react-icons/fa";
import AlertModal from "../components/modals/AlertModal";
import { updateTrainerInfo, getTrainerById } from "../api/trainerApi";

const initTrainerData = {
  userName: "",
  trainerCareer: "",
  trainerAbout: "",
  trainerImage: "",
  userId: "",
};

const TrainerSet = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData } = useAuth();
  const [trainerData, setTrainerData] = useState(initTrainerData);
  const [imagePreview, setImagePreview] = useState(null);
  const [trainerImageFile, setTrainerImageFile] = useState(null);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const { validateInput } = useValidation();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchTrainerData = async () => {
      if (userData?.userId) {
        try {
          console.log("Fetching trainer data for userId:", userData.userId);
          const data = await getTrainerById(userData.userId);
          console.log("Received trainer data:", data);
          setTrainerData({
            ...data,
            userId: userData.userId,
          });
          if (data.trainerImage) {
            setImagePreview(`/images/${data.trainerImage}`);
          }
        } catch (error) {
          console.error("Failed to fetch trainer data:", error);
        }
      }
    };
    fetchTrainerData();
  }, [userData]);

  const handleTrainerDataChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "trainerImage" && files.length > 0) {
      const file = files[0];
      setTrainerImageFile(file);
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setTrainerData({
        ...trainerData,
        [name]: value,
      });
      validateInput(name, value);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setTrainerData({
      ...trainerData,
      trainerImage: "",
    });
    setTrainerImageFile(null);
    fileInputRef.current.value = null;
  };

  const handleSubmit = async () => {
    try {
      console.log("Submitting trainer data:", trainerData);
      console.log("Trainer image file:", trainerImageFile);
      console.log("Remove image:", !trainerImageFile && !imagePreview);
      await updateTrainerInfo(trainerData, trainerImageFile, !trainerImageFile && !imagePreview);
      setIsAlertModalVisible(false);
      navigate("/centerView", { replace: true });
    } catch (error) {
      console.error("Failed to update trainer information:", error);
    }
  };

  const handleConfirmClick = () => {
    setIsAlertModalVisible(true);
  };

  return (
    <>
      <div className="space-y-8 relative flex flex-col items-center justify-center my-10">
        <div className="flex flex-col space-y-6 relative">
          <p className="font-extrabold text-2xl pb-4 flex flex-row items-center">
            <box-icon name="cog" size="40px" color="#9f8d8d"></box-icon>
            트레이너 정보 설정
          </p>
          <div className="py-10 px-7 mx-6 rounded-lg flex flex-col space-y-4 w-[1000px] h-fit border border-peach-fuzz bg-white">
            {/* 트레이너 이름 */}
            <div className="flex flex-row space-x-32">
              <p className="mt-3">트레이너 이름</p>
              <Input
                label="트레이너 이름"
                width="320px"
                name="userName"
                value={userData?.userName || ""}
                required={true}
                readonly={true}
              ></Input>
            </div>

            {/* 트레이너 경력 */}
            <div className="flex flex-row space-x-32">
              <p className="mt-3">트레이너 경력</p>
              <Input
                label="트레이너 경력"
                width="320px"
                name="trainerCareer"
                value={trainerData.trainerCareer}
                required={true}
                onChange={handleTrainerDataChange}
              ></Input>
            </div>

            {/* 트레이너 소개 */}
            <div className="flex flex-row space-x-32">
              <p className="mt-3">트레이너 소개</p>
              <TextArea
                label="트레이너 소개"
                width="500px"
                name="trainerAbout"
                value={trainerData.trainerAbout}
                required={true}
                onChange={handleTrainerDataChange}
              ></TextArea>
            </div>

            {/* 트레이너 사진 */}
            <div className="flex flex-row space-x-32">
              <p className="mt-3">트레이너 사진</p>
              <div className="flex flex-row relative">
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={imagePreview}
                      alt="Trainer Preview"
                      className="rounded-lg w-80 h-fit object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center"
                      onClick={handleImageRemove}
                      style={{ zIndex: 10 }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ) : (
                  <button
                    className="flex flex-row text-sm my-4 mr-12"
                    type="button"
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                  >
                    <BiSolidImageAdd size="24" color="#9F8D8D" /> 이미지 추가
                  </button>
                )}
                <input
                  className="hidden"
                  type="file"
                  name="trainerImage"
                  ref={fileInputRef}
                  onChange={handleTrainerDataChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <Button
            width="120px"
            color="peach-fuzz"
            label="정보등록"
            onClick={handleConfirmClick}
          />
        </div>
      </div>
      {isAlertModalVisible && (
        <AlertModal
          headerEmoji={"✔️"}
          line1={"트레이너 정보 수정이 완료되었습니다!"}
          button2={{
            label: "확인",
            onClick: handleSubmit,
          }}
        />
      )}
    </>
  );
};

export default TrainerSet;
