import React, { useEffect, useState } from "react";
import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";

import { CgDetailsMore } from "react-icons/cg";
import { FaLocationDot } from "react-icons/fa6";
import { PiPhoneListDuotone } from "react-icons/pi";
import { LuTimer } from "react-icons/lu";
import { BsPersonVcard } from "react-icons/bs";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";

import Review from "../components/view/Review";
import TrainerInfo from "../components/view/TrainerInfo";
import Button from "../components/shared/Button";
import CenterImg from "../components/view/CenterImg";
import priceImg from "../assets/priceImg.jpeg";
import useCustomNavigate from "../hooks/useCustomNavigate";
import { useLocation } from "react-router-dom";
import AlertModal from "../components/modals/AlertModal";
import { findMembership } from "../api/membershipApi";
import { findPT } from "../api/ptApi";
import { GymInfo } from "../api/gymApi";
import { useLoginModalContext } from "../context/LoginModalContext";
import useTyping from "../hooks/useTyping";
import { useModal } from "../hooks/useModal";
import EventModal from "../components/modals/EventModal";

const CenterView = () => {
  const [gymData, setGymData] = useState(null);
  const [isMembershipAlreadyRegistered, setIsMembershipAlreadyRegistered] = useState(false);
  const [isPTAlreadyRegistered, setIsPTAlreadyRegistered] = useState(false);
  const { toggleLoginModal } = useLoginModalContext();
  const customNavigate = useCustomNavigate();
  const location = useLocation();
  const gymId = location.state?.gym?.gymId || "";
  

  //헬스장 소개글 불러와야함
  const introduce = "Gymdata에 introduce불러오기";
  const { text: introduceText, isEnd: isintroduceEnd } = useTyping(introduce);

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
        customNavigate("/PtRegister", { state: { gym: gymData } });
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
      <div className="flex flex-col space-y-5 mt-10">
        <div className="flex flex-row ml-40 items-center font-semibold text-2xl mb-3">
          <div className="mr-2 text-3xl">💡</div> 상세정보
        </div>
        {/* 헬스장 정보 */}
        <div className="flex flex-col space-y-36">
          <div className="w-full h-[500px]  flex bg-grayish-red bg-opacity-20">
            <div className="box-border w-[50%] flex justify-center items-center ">
              <Map // 지도를 표시할 Container
                className="rounded-lg"
                id="map"
                center={{
                  // 지도의 중심좌표
                  lat: 33.450701,
                  lng: 126.570667,
                }}
                style={{
                  // 지도의 크기
                  width: "80%",
                  height: "400px",
                }}
                level={3} // 지도의 확대 레벨
              >
                <MapMarker // 마커를 생성합니다
                  position={{
                    // 마커가 표시될 위치입니다
                    lat: 33.450701,
                    lng: 126.570667,
                  }}
                />
              </Map>
            </div>
            <div className="relative flex flex-col space-y-7 box-border justify-center w-[50%]">
              <p className="text-3xl font-semibold">{gymData.gymName}</p>
              <div className="flex flex-row">
                <FaLocationDot size="32" className="mr-3" color="#fe8742" />
                <div className="flex flex-col ">
                  <p className="font-semibold text-xl"> 주소 </p>
                  <div>{gymData.address} {gymData.detailAddress}</div>
                </div>
              </div>
              <div className="flex flex-row">
                <LuTimer size="32" className="mr-3" color="#fe8742" />
                <div className="flex flex-col ">
                  <p className="font-semibold text-xl"> 운영시간 </p>
                  <div>{gymData.operatingHours}</div>
                </div>
              </div>
              <div className="flex flex-row">
                <PiPhoneListDuotone size="32" className="mr-3" color="#fe8742" />
                <div className="flex flex-col">
                  <p className="font-semibold text-xl"> 전화번호 </p>
                  <div>{gymData.phoneNumber}</div>
                </div>
              </div>
              <div className="absolute right-44 bottom-8 flex flex-row space-x-3">
                <div className="">
                  <Button
                    width="100px"
                    label="1:1 메시지"
                    height="40px"
                    className="hover:font-semibold">
                  </Button>
                </div>
                <div className="">
                  <Button
                    width="100px"
                    label="🎉 Event"
                    height="40px"
                    className="hover:font-semibold">
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* 헬스장 설명 */}
          <div className="flex justify-center items-center w-full h-full">
            <div className="max-w-[1000px]">
              <div className='text-base sm:text-lg'>
                {introduceText}
                <span className={`${isintroduceEnd ? 'hidden' : 'animate-typing'} `}>|</span>
              </div>
            </div>
          </div>

          {/* 헬스장 사진 */}
          <CenterImg gymId={gymId} />

          {/* 헬스장 가격표 */}
          <div className="w-full h-full p-5 flex flex-col items-center rounded-3xl bg-grayish-red bg-opacity-20 rounded-b-none">
            <div className="my-10">
              <div className="flex flex-col items-center text-center mb-2 font-semibold text-xl">
                가격표
                <div className="mt-2 w-16 border-b-2 border-grayish-red border-opacity-20"></div>
              </div>
            </div>
            {/* 가격표이미지가져오기 */}
            <div className="max-w-[1000px] max-h-full bg-grayish-red bg-opacity-20">
              <img src={priceImg} />
            </div>
          </div>

          {/* 트레이너 소개 */}
          <TrainerInfo />
          {/* 헬스장 리뷰 */}
          <Review />
        </div>
      </div>
      {/* 헬스권/PT등록버튼 */}
      <div className="flex flex-col space-y-3">
        <button 
          onClick={() =>
            sessionStorage.getItem("isLoggedIn")
              ? handleMembershipInfo()
              : toggleLoginModal()
          }
          className="flex flex-col justify-center items-center fixed bottom-32 right-16 w-20 h-20 rounded-full bg-[#4E4C4F] text-[11px] text-white hover:bg-opacity-45 hover:border-2 hover:border-stone-500">
          <BsPersonVcard color="white" size={33} />
          <p>회원권 등록</p>
        </button>
        <button 
          onClick={() =>
            sessionStorage.getItem("isLoggedIn")
              ? handlePTInfo()
              : toggleLoginModal()
          }
          className="flex flex-col justify-center items-center fixed bottom-10 right-16 w-20 h-20 rounded-full bg-grayish-red text-[12px] text-white hover:bg-opacity-45 hover:border-2 hover:border-stone-500">
          <LiaChalkboardTeacherSolid color="white" size={38} />
          <p>PT 등록</p>
        </button>
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
