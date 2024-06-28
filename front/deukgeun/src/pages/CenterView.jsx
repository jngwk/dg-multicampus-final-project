import React, { useEffect, useState } from "react";
import Review from "../components/view/Review";
import TrainerInfo from "../components/view/TrainerInfo";
import Button from "../components/shared/Button";
import useCustomNavigate from "../hooks/useCustomNavigate";
import { useLocation } from "react-router-dom";
import AlertModal from "../components/modals/AlertModal";
import { findMembership } from "../api/membershipApi";
import { findPT } from "../api/ptApi";

import { GymInfo } from "../api/gymApi";

const CenterView = () => {
  const [gymData, setGymData] = useState(null);
  const [isMembershipAlreadyRegistered, setIsMembershipAlreadyRegistered] = useState(false);
  const [isPTAlreadyRegistered, setIsPTAlreadyRegistered] = useState(false);
  const customNavigate = useCustomNavigate();
  const location = useLocation();
  const gymId = location.state?.gym?.gymId || "";

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const data = await GymInfo(gymId);
        setGymData(data);
      } catch (error) {
        console.error("Error fetching gym info:", error);
      }
    };

    fetchGymData();
  }, [gymId]);

  const handleMembershipInfo = async () => {
    try {
      const membership = await findMembership();
      if (membership) {
        setIsMembershipAlreadyRegistered(true);
      } else {
        customNavigate("/memberregister", { state: { gym: gymData } });
      }
    } catch (error) {
      console.error("Error checking membership:", error);
    }
  };

  const handlePTInfo = async () => {
    try {
      const PT = await findPT();
      if (PT) {
        setIsPTAlreadyRegistered(true);
      } else {
        customNavigate("/Ptregister", { state: { gym: gymData } });
      }
    } catch (error) {
      console.error("Error checking PT:", error);
    }
  };

  if (!gymData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col space-y-5">
        <h1>Gym Details</h1>
        <strong>Address:</strong> {gymData.address}
        <p><strong>Detail Address:</strong> {gymData.detailAddress}</p>
        <p><strong>Gym Name:</strong> {gymData.gymName}</p>
        <p><strong>Introduction:</strong> {gymData.introduce}</p>
        <p><strong>Operating Hours:</strong> {gymData.operatingHours}</p>
        <p><strong>Phone Number:</strong> {gymData.phoneNumber}</p>

        <h2>Trainers</h2>
        <ul>
          {gymData.trainersList.map((trainer) => (
            <li key={trainer.trainerId}>
              <p><strong>Name:</strong> {trainer.userName}</p>
              <p><strong>Career:</strong> {trainer.trainerCareer}</p>

              <img src={trainer.trainerImage} alt={`${trainer.userName}`} />
            </li>
          ))}
        </ul>
        <h2>Products</h2>
        <ul>
          {gymData.productList.map((product) => (
            <li key={product.productId}>
              <p><strong>Name:</strong> {product.productName}</p>
              <p><strong>Price:</strong> {product.price}</p>
              <p><strong>Days:</strong> {product.days}</p>
              {product.ptCountTotal && (
                <p><strong>PT Count Total:</strong> {product.ptCountTotal}</p>
              )}
            </li>
          ))}
        </ul>
        <Button
                width="120px"
                color="peach-fuzz"
                label="헬스권 등록"
                onClick={handleMembershipInfo}
              />
        <Button
                width="120px"
                color="peach-fuzz"
                label="PT 등록"
                onClick={handlePTInfo}
              />
        <div className="flex flex-col space-y-56">
          <TrainerInfo />
          <Review />
        </div>
      </div>

      {/* Alert modal to display if membership is already registered */}
      {isMembershipAlreadyRegistered && (
        <AlertModal
          headerEmoji={"⚠️"}
          line1={"이미 헬스권이 등록된 회원입니다."}
          button2={{
            label: "확인",
            onClick: () => setIsMembershipAlreadyRegistered(false),
          }}
        />
      )}
      {isPTAlreadyRegistered && (
        <AlertModal
          headerEmoji={"⚠️"}
          line1={"이미 PT가 등록된 회원입니다."}
          button2={{
            label: "확인",
            onClick: () => setIsPTAlreadyRegistered(false),
          }}
        />
      )}
    </>
  );
};

export default CenterView;