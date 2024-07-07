import React, { useEffect, useState, useRef } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { CgDetailsMore } from "react-icons/cg";
import { HiChevronUp } from "react-icons/hi";
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
import bgimg from "../assets/reg.png";
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

  const infoRef = useRef(null);
  const introduceRef = useRef(null);
  const imgRef = useRef(null);
  const priceRef = useRef(null);
  const trainerRef = useRef(null);
  const reviewRef = useRef(null);
  const menuRef = useRef(null);

  const [page, setPage] = useState(1);
  const lastPageRef = useRef(0);

  // useEffect(() => {
  //   lastPageRef.current = 7;

  //   const infoRefTop = infoRef.current.offsetTop;

  //   const handleWheel = (e) => {
  //     e.preventDefault();

  //     if (e.deltaY > 0) {
  //       if (page === lastPageRef.current) return;

  //       const nextPage = page + 1;
  //       const posTop = (nextPage - 1) * window.innerHeight + infoRefTop;
  //       setPage(nextPage);
  //       document.documentElement.scrollTo({ top: posTop, behavior: "smooth" });
  //     } else if (e.deltaY < 0) {
  //       if (page === 1) return;

  //       const prevPage = page - 1;
  //       const posTop = (prevPage - 1) * window.innerHeight + infoRefTop;
  //       setPage(prevPage);
  //       document.documentElement.scrollTo({ top: posTop, behavior: "smooth" });
  //     }
  //   };

  //   window.addEventListener("wheel", handleWheel, { passive: false });

  //   return () => {
  //     window.removeEventListener("wheel", handleWheel);
  //   };
  // }, [page, infoRef]);

  // useEffect(() => {
  //   const posTop = (page - 1) * window.innerHeight + infoRef.current.offsetTop;
  //   document.documentElement.scrollTo({ top: posTop, behavior: "smooth" });
  // }, [page, infoRef]);

  // 헬스장 소개글 불러와야함
  const introduce = gymData.introduce;
  const { text: introduceText, isEnd: isintroduceEnd } = useTyping(introduce);

  useEffect(() => {
    if (gymData) {
      // console.log("gymData from location in center view", gymData);
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

  const handleScrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleScrollToTop = () => {
    // document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
    console.log("clicked");
    // document.body.scrollIntoView({ behavior: "smooth" });
    // window.scrollTo(0, 0);
    menuRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  return (
    <>
      <div className="relative flex flex-col space-y-5">
        {/* <div className="flex flex-row ml-40 items-center font-semibold text-2xl mb-3">
          <CgDetailsMore size="38" className="mr-3" />
          상세정보
        </div> */}
        {/* 헬스장 정보 */}
        <div className="flex flex-col min-h-screen">
          <div
            ref={menuRef}
            className="flex flex-row space-x-40 justify-center item-center mb-6 "
          >
            <button
              className="text-2xl font-bold hover:border-grayish-red hover:border-b hover:text-peach-fuzz text-grayish-red "
              onClick={() => handleScrollToSection(infoRef)}
            >
              정보
            </button>
            <button
              className="text-2xl font-bold hover:border-grayish-red hover:border-b hover:text-peach-fuzz text-grayish-red"
              onClick={() => handleScrollToSection(introduceRef)}
            >
              소개
            </button>
            <button
              className="text-2xl font-bold hover:border-grayish-red hover:border-b hover:text-peach-fuzz text-grayish-red"
              onClick={() => handleScrollToSection(imgRef)}
            >
              시설
            </button>
            <button
              className="text-2xl font-bold hover:border-grayish-red hover:border-b hover:text-peach-fuzz text-grayish-red"
              onClick={() => handleScrollToSection(priceRef)}
            >
              가격
            </button>
            <button
              className="text-2xl font-bold hover:border-grayish-red hover:border-b hover:text-peach-fuzz text-grayish-red"
              onClick={() => handleScrollToSection(trainerRef)}
            >
              트레이너
            </button>
            <button
              className="text-2xl font-bold hover:border-grayish-red hover:border-b hover:text-peach-fuzz text-grayish-red"
              onClick={() => handleScrollToSection(reviewRef)}
            >
              리뷰
            </button>
          </div>
          <div
            ref={infoRef}
            className="w-full min-h-screen flex flex-col justify-center items-center bg-grayish-red bg-opacity-15 p-20"
          >
            <div className="flex w-full py-10 bg-white rounded-[55px] ">
              <div className="box-border w-[50%] flex justify-center items-center">
                {!mapLoading ? (
                  gymLocation ? (
                    <Map
                      className="rounded-lg"
                      id="map"
                      center={gymLocation}
                      style={{
                        width: "80%",
                        height: "500px",
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
              <div className="flex flex-col space-y-7 box-border justify-center items w-1/2 p-14">
                <p
                  className="text-6xl font-semibold mb-10 w-fit rounded-2xl underline-offset-8 p-4"
                  style={{
                    textDecoration: "underline",
                    textDecorationStyle: "wavy",
                    textDecorationColor: "rgba(254, 135, 66, 0.4)",
                  }}
                >
                  {gymData.user.userName}
                </p>
                <div className="flex flex-row">
                  <FaLocationDot
                    size="32"
                    className="mr-3 opacity-90"
                    color="#fe8742"
                  />
                  <div className="flex flex-col">
                    <p className="font-semibold text-2xl "> 주소 </p>
                    <div>
                      {gymData.address} {gymData.detailAddress}
                    </div>
                  </div>
                </div>
                <div className="flex flex-row">
                  <LuTimer size="32" className="mr-3" color="#fe8742" />
                  <div className="flex flex-col ">
                    <p className="font-semibold text-2xl"> 운영시간 </p>
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
                    <p className="font-semibold text-2xl"> 전화번호 </p>
                    <div>{gymData.phoneNumber}</div>
                  </div>
                </div>
                <div className="flex flex-row justify-end space-x-3 ">
                  <div>
                    <Button
                      width="170px"
                      label="문의하기"
                      height="50px"
                      className="hover:font-semibold bg-opacity-60"
                      onClick={() =>
                        sessionStorage.getItem("isLoggedIn")
                          ? setIsChatModalVisible(true)
                          : toggleLoginModal()
                      }
                    ></Button>
                  </div>
                  <div>
                    <Button
                      width="170px"
                      label="🎉 Event"
                      height="50px"
                      className="hover:font-semibold bg-opacity-60 border-"
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 헬스장 설명 */}
          {introduce && (
            <div
              ref={introduceRef}
              className="snap-start relative flex justify-center items-center w-full min-h-screen"
            >
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url(${bgimg})`,
                  backgroundSize: "cover",
                  opacity: 0.45,
                  zIndex: -9,
                }}
              ></div>
              <div className="max-w-full">
                <div
                  className="text-4xl sm:text-4xl font-semibold text-zinc-800 drop-shadow-lg tracking-wide"
                  style={{ lineHeight: "1.5" }}
                >
                  {introduceText.split("\n").map((line, index) => (
                    <React.Fragment key={index}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                  <span
                    className={`${
                      isintroduceEnd ? "hidden" : "animate-typing"
                    }`}
                  >
                    |
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 헬스장 사진 */}
          <div
            ref={imgRef}
            className="snap-start w-full min-h-screen flex justify-center items-center"
          >
            <CenterImg gymId={gymId} />
          </div>
          {/* 헬스장 가격표 */}
          <div
            ref={priceRef}
            className="snap-start w-full min-h-screen flex justify-center items-center bg-grayish-red bg-opacity-20"
          >
            <div className="w-[60%] h-full p-20 flex flex-col items-center">
              <div className="mb-10">
                <div className="flex flex-col items-center text-center mb-2 font-semibold text-2xl">
                  가격표
                  <div className="mt-2 w-16 border-b-2 border-grayish-red border-opacity-20"></div>
                </div>
              </div>
              <div className="">
                <div className="flex justify-between items-start w-[1700px]">
                  {gymData.productList?.length > 0 ? (
                    <>
                      <div className="w-fit grid gap-x-8 gap-y-4 grid-cols-2">
                        {gymData.productList
                          .filter(
                            (product) =>
                              product.ptCountTotal > 0 &&
                              product.status !== false
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
                                          state: {
                                            product: product,
                                            gym: gymData,
                                          },
                                        });
                                  },
                                }}
                              />
                            );
                          })}
                      </div>

                      <div className="w-fit grid gap-x-8 gap-y-4 grid-cols-2">
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
                                          state: {
                                            product: product,
                                            gym: gymData,
                                          },
                                        });
                                  },
                                }}
                              />
                            );
                          })}
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col gap-10 justify-center items-center h-[618px] w-full">
                      <span className="text-4xl">😔</span>
                      <span className="text-xl">등록된 상품이 없습니다</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 트레이너 소개 */}
          <div
            ref={trainerRef}
            className="snap-start w-full min-h-screen flex justify-center items-center "
          >
            <TrainerInfo trainers={gymData.trainerList} />
          </div>
          {/* 헬스장 리뷰 */}
          <div
            ref={reviewRef}
            className="w-full min-h-screen flex justify-center items-center bg-grayish-red bg-opacity-15"
          >
            <Review gymId={gymId} />
          </div>
        </div>
      </div>

      {/* 헬스권/PT등록버튼 */}
      <div className="flex flex-col space-y-3">
        {/* top버튼 */}
        <button
          onClick={() => handleScrollToTop()}
          className="flex flex-col justify-center items-center fixed bottom-52 right-16 w-20 h-20 rounded-full text-[12px] font-semibold text-black "
        >
          <HiChevronUp size={35} />
          <p>Top</p>
        </button>
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
