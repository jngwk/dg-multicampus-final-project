// GymInfo.jsx

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { PiPhoneListDuotone } from "react-icons/pi"; // Picons 아이콘
import { LuTimer } from "react-icons/lu"; // Lineicons 아이콘
import Button from "../components/shared/Button";
import CenterImg from "../components/view/CenterImg";
import useCustomNavigate from "../hooks/useCustomNavigate";
import { GymInfoByUserId as fetchGymInfo } from "../api/gymApi";

const GymInfo = () => {

  const [gymData, setGymData] = useState(null);
  const customNavigate = useCustomNavigate();

  useEffect(() => {
    const fetchGymData = async () => {
      try {
        const data = await fetchGymInfo(); // gymId를 이용해 헬스장 정보 가져오기
        setGymData(data);
      } catch (error) {
        console.error("Error fetching gym info:", error);
        // 에러 처리 로직 추가 가능
      }
    };

    fetchGymData();
  }, []);
  if (!gymData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-5 mt-10">
      {/* 헬스장 정보 */}
      <div className="flex flex-col space-y-5">
        <div className="text-3xl font-semibold">{gymData.gymName}</div>
        <div>
            <p className="font-semibold text-xl">주소</p>
            <div>{gymData.address} {gymData.detailAddress}</div>
        </div>
        <div className="flex items-center">
          <LuTimer size="32" className="mr-3" color="#fe8742" />
          <div>
            <p className="font-semibold text-xl">운영 시간</p>
            <div>{gymData.operatingHours}</div>
          </div>
        </div>
        <div className="flex items-center">
          <PiPhoneListDuotone size="32" className="mr-3" color="#fe8742" />
          <div>
            <p className="font-semibold text-xl">전화번호</p>
            <div>{gymData.phoneNumber}</div>
          </div>
        </div>
      </div>

      {/* 헬스장 등록 버튼 */}
      <div className="flex justify-center items-center mt-10">
        <Button
          width="200px"
          label="정보 수정 또는 등록하기"
          onClick={() => customNavigate(`/GymSet/${gymData.gymId}`)} // gymId를 이용해 수정 페이지로 이동
        />
      </div>
    </div>
  );
};

export default GymInfo;
