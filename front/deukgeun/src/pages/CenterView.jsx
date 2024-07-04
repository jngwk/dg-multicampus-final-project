import React, { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
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
import Fallback from "../components/shared/Fallback";
import ChatModal from "../components/modals/ChatModal";
import Loader from "../components/shared/Loader";
import BasicCard from "../components/shared/BasicCard";
import { format } from "date-fns";
const { kakao } = window;

const CenterView = () => {
  const location = useLocation();
  const [gymData, setGymData] = useState(location.state?.gym || "");
  const [isMembershipAlreadyRegistered, setIsMembershipAlreadyRegistered] =
    useState(false);
  const [isPTAlreadyRegistered, setIsPTAlreadyRegistered] = useState(false);
  const { toggleLoginModal } = useLoginModalContext();
  const [gymDataLoading, setGymDataLoading] = useState(false);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [gymLocation, setGymLocation] = useState();
  const [mapLoading, setMapLoading] = useState(true);
  const customNavigate = useCustomNavigate();
  const gymId = location.state?.gym?.gymId || "";

  // 헬스장 소개글 불러와야함
  const introduce = gymData.introduce;
  const { text: introduceText, isEnd: isintroduceEnd } = useTyping(introduce);

  useEffect(() => {
    if (gymData) {
      console.log("gymData from location in center view", gymData);
      return;
    }
    const fetchGymData = async () => {
      try {
        // setGymDataLoading(true);
        console.log("@@@@@@@@@@@@@@@@@@@fetch gym data in center view");
        const data = await GymInfo(gymId);
        setGymData(data);
      } catch (error) {
        console.error("Error fetching gym info:", error);
      } finally {
        setGymDataLoading(false);
      }
    };

    fetchGymData();
  }, [gymId]);

  useEffect(() => {
    const convertAddressToLatLng = (address) => {
      // console.log("address", address);
      return new Promise((resolve, reject) => {
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.addressSearch(address, function (result, status) {
          // console.log("result in convert address", result, status);
          if (status === kakao.maps.services.Status.OK) {
            // console.log("okay");
            resolve({ lat: result[0].y, lng: result[0].x });
          } else {
            reject(new Error("Failed to convert address to lat/lng"));
          }
        });
      });
    };
    const getGymLocation = async (address) => {
      try {
        setMapLoading(true);
        const latlng = await convertAddressToLatLng(address);
        setGymLocation({ lat: latlng.lat, lng: latlng.lng });
        console.log(latlng);
      } catch (error) {
        console.error("error converting address to latlng", error);
      } finally {
        setMapLoading(false);
      }
    };
    getGymLocation(gymData.address);
    console.log("gymData product list", gymData.productList);
  }, []);

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
  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const formatDate = (date) => {
    return format(date, "yyyy-MM-dd"); // Adjust the format as needed
  };

  const Today = new Date();

  if (gymDataLoading) {
    return <Fallback />;
  }

  return (
    <>
      <div className="flex flex-col space-y-5">
        {/* <div className="flex flex-row ml-40 items-center font-semibold text-2xl mb-3">
          <CgDetailsMore size="38" className="mr-3" />
          상세정보
        </div> */}
        {/* 헬스장 정보 */}
        <div className="flex flex-col space-y-36">
          <div className="w-full h-[500px] flex justify-center items-center bg-grayish-red bg-opacity-20">
            <div className="flex w-3/4">
              <div className="box-border w-[50%] flex justify-center items-center">
                {!mapLoading ? (
                  gymLocation ? (
                    <Map
                      className="rounded-lg"
                      id="map"
                      center={gymLocation}
                      style={{
                        width: "80%",
                        height: "400px",
                      }}
                      level={3}
                    >
                      <MapMarker position={gymLocation} />
                    </Map>
                  ) : (
                    ""
                  )
                ) : (
                  <Loader />
                )}
              </div>
              {/* text 정보 */}
              <div className="relative flex flex-col space-y-7 box-border justify-center w-[450px] pl-14">
                <p className="text-3xl font-semibold">
                  {gymData.user.userName}
                </p>
                <div className="flex flex-row">
                  <FaLocationDot size="32" className="mr-3" color="#fe8742" />
                  <div className="flex flex-col">
                    <p className="font-semibold text-xl"> 주소 </p>
                    <div>
                      {gymData.address} {gymData.detailAddress}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row">
                  <LuTimer size="32" className="mr-3" color="#fe8742" />
                  <div className="flex flex-col">
                    <p className="font-semibold text-xl"> 운영시간 </p>
                    <div>{gymData.operatingHours}</div>
                  </div>
                </div>
                <div className="flex flex-row">
                  <PiPhoneListDuotone
                    size="32"
                    className="mr-3"
                    color="#fe8742"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-xl"> 전화번호 </p>
                    <div>{gymData.phoneNumber}</div>
                  </div>
                </div>
                <div className="flex flex-row justify-end space-x-3 ">
                  <div>
                    <Button
                      width="100px"
                      label="문의하기"
                      height="40px"
                      className="hover:font-semibold"
                      onClick={() =>
                        sessionStorage.getItem("isLoggedIn")
                          ? setIsChatModalVisible(true)
                          : toggleLoginModal()
                      }
                    ></Button>
                  </div>
                  <div>
                    <Button
                      width="100px"
                      label="🎉 Event"
                      height="40px"
                      className="hover:font-semibold"
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 헬스장 설명 */}
          <div className="flex justify-center items-center w-full h-full">
            <div className="max-w-[1000px]">
              <div className="text-base sm:text-lg">
                {introduceText}
                <span
                  className={`${isintroduceEnd ? "hidden" : "animate-typing"}`}
                >
                  |
                </span>
              </div>
            </div>
          </div>

          {/* 헬스장 사진 */}
          <CenterImg gymId={gymId} />

          {/* 헬스장 가격표 */}
          <div className="w-full-h-full flex justify-center items-center">
            <div className="w-[60%] h-full p-20 flex flex-col items-center rounded-3xl bg-grayish-red bg-opacity-20">
              <div className="mb-10">
                <div className="flex flex-col items-center text-center mb-2 font-semibold text-xl">
                  가격표
                  <div className="mt-2 w-16 border-b-2 border-grayish-red border-opacity-20"></div>
                </div>
              </div>
              <div className="">
                <div className="flex justify-between items-start w-[700px]">
                  <div className="w-[275px] flex flex-col gap-6">
                    {gymData.productList
                      .filter(
                        (product) =>
                          product.ptCountTotal > 0 && product.status !== false
                      )
                      .sort((a, b) => a.ptCountTotal - b.ptCountTotal)
                      .map((product, key) => {
                        const endDate = addDays(Today, product.days);
                        return (
                          <BasicCard
                            key={key}
                            type={"PT"}
                            header={product.productName}
                            shortDesc={`${product.price}원`}
                            desc={`만료일: ${formatDate(endDate)}`}
                            button={{
                              label: "등록하기",
                              onClick: () => {
                                !sessionStorage.getItem("isLoggedIn")
                                  ? toggleLoginModal()
                                  : customNavigate("/PtRegister", {
                                      state: { product: product, gym: gymData },
                                    });
                              },
                            }}
                          />
                        );
                      })}
                  </div>
                  <div className="w-[275px] flex flex-col gap-6">
                    {gymData.productList
                      .filter((product) => product.ptCountTotal === 0)
                      .sort((a, b) => a.days - b.days)
                      .map((product, key) => {
                        const endDate = addDays(Today, product.days);
                        return (
                          <BasicCard
                            key={key}
                            type={"회원권"}
                            header={product.productName}
                            shortDesc={`${product.price}원`}
                            desc={`만료일: ${formatDate(endDate)}`}
                            button={{
                              label: "등록하기",
                              onClick: () => {
                                !sessionStorage.getItem("isLoggedIn")
                                  ? toggleLoginModal()
                                  : customNavigate("/memberregister", {
                                      state: { product: product, gym: gymData },
                                    });
                              },
                            }}
                          />
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 트레이너 소개 */}
          <TrainerInfo trainers={gymData.trainerList} />
          {/* 헬스장 리뷰 */}
          <Review gymId={gymId} />
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
          className="flex flex-col justify-center items-center fixed bottom-32 right-16 w-20 h-20 rounded-full bg-[#4E4C4F] text-[11px] text-white hover:bg-opacity-45 hover:border-2 hover:border-stone-500"
        >
          <BsPersonVcard color="white" size={33} />
          <p>회원권 등록</p>
        </button>
        <button
          onClick={() =>
            sessionStorage.getItem("isLoggedIn")
              ? handlePTInfo()
              : toggleLoginModal()
          }
          className="flex flex-col justify-center items-center fixed bottom-10 right-16 w-20 h-20 rounded-full bg-grayish-red text-[12px] text-white hover:bg-opacity-45 hover:border-2 hover:border-stone-500"
        >
          <LiaChalkboardTeacherSolid color="white" size={38} />
          <p>PT 등록</p>
        </button>
      </div>

      {isChatModalVisible && sessionStorage.getItem("isLoggedIn") && (
        <ChatModal
          toggleModal={() => setIsChatModalVisible(false)}
          selectedGym={gymData}
        />
      )}
      {/* Alert modal to display if membership is already registered */}
      {isMembershipAlreadyRegistered && (
        <AlertModal
          headerEmoji={"⚠️"}
          line1={"이미 회원권이 등록된 회원입니다."}
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
