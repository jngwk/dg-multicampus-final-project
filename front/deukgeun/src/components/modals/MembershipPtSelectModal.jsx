import React, { useEffect, useState } from "react";
import ModalLayout from "./ModalLayout";
import Button from "../shared/Button";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { findMembership } from "../../api/membershipApi";

const MembershipPtSelectModal = ({ toggleModal, selectedGym }) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const customNavigate = useCustomNavigate();

  useEffect(() => {
    const getMembership = async () => {
      console.log("gym is select modal", selectedGym);
      try {
        const data = await findMembership();
        console.log("find membership in modal", data);
        if (data && data.gym.gymId === selectedGym.gymId) {
          setIsRegistered(true);
        }
      } catch (error) {
        console.error(error);
      }
    };
    getMembership();
  });

  const handleMembershipButtonClick = () => {
    console.log("in modal", selectedGym);
    customNavigate("/memberregister", { state: { gym: selectedGym } });
  };
  const handlePtButtonClick = () => {
    customNavigate("/PtRegister", { state: { gym: selectedGym } });
  };

  return (
    <ModalLayout toggleModal={toggleModal}>
      <div className="flex flex-col justify-center items-center gap-14">
        <span className="font-semibold text-xl text-center">
          {selectedGym.user.userName}
        </span>
        <div className="flex flex-col justify-center items-center gap-7">
          <Button
            height="60px"
            label={"회원권 등록하기 🔥"}
            onClick={() => handleMembershipButtonClick()}
          />
          <hr className="w-8 bg-black/50 h-0.5" />
          <Button
            height="60px"
            label={"PT 등록하기 💪🏼"}
            color={"bright-orange"}
            onClick={() => handlePtButtonClick()}
          />
        </div>
      </div>
      {isRegistered && (
        <div className="mt-8 flex flex-col items-center">
          <p className="text-sm before:content-['*'] before:text-red-500 before:mr-1">
            이미 등록되어 있는 헬스장입니다.
          </p>
          <p className="text-sm text-nowrap">
            (추가 결제시, 기간 또는 PT 횟수가 연장됩니다.)
          </p>
        </div>
      )}
    </ModalLayout>
  );
};

export default MembershipPtSelectModal;
