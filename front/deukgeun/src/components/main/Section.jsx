import React, { useState, useEffect } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Button from "../shared/Button";
import underline from "../../assets/curved-underline.png";
import orangeUnderline from "../../assets/curved-underline-orange.png";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { useLoginModalContext } from "../../context/LoginModalContext";
import Slider from "@ant-design/react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import ChartDemo from "../ChartDemo";
import { getGymResList, getGymResListByLocation } from "../../api/gymApi";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import healthImage1 from "../../assets/healthImage1.jpg";

import healthImage2 from "../../assets/healthImage2.jpg";
import healthImage3 from "../../assets/healthImage3.jpg";
import healthImage4 from "../../assets/healthImage4.jpg";
import healthImage5 from "../../assets/healthImage5.jpg";
// import calendarDemo from "../../assets/calendar-demo.webp";

const getInitialEvents = () => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  return [
    {
      title: "하체",
      start: new Date(currentYear, currentMonth, 3),
      id: "1",
      color: "#43a047",
    },
    {
      title: "가슴",
      start: new Date(currentYear, currentMonth, 5),
      id: "2",
    },
    {
      title: "등",
      start: new Date(currentYear, currentMonth, 7),
      id: "3",
    },
    {
      title: "어깨",
      start: new Date(currentYear, currentMonth, 10),
      id: "4",
    },
    {
      title: "하체",
      start: new Date(currentYear, currentMonth, 15),
      id: "5",
      color: "#43a047",
    },
    {
      title: "상체",
      start: new Date(currentYear, currentMonth, 17),
      id: "6",
    },
    {
      title: "이두/삼두",
      start: new Date(currentYear, currentMonth, 20),
      id: "7",
    },
    {
      title: "하체",
      start: new Date(currentYear, currentMonth, 25),
      id: "8",
      color: "#43a047",
    },
    {
      title: "가슴",
      start: new Date(currentYear, currentMonth, 29),
      id: "9",
    },
  ];
};

const { kakao } = window;
//  TODO snap scroll 안됨
const Section = ({}) => {
  const { userData } = useAuth();
  const customNavigate = useCustomNavigate();
  const { toggleLoginModal } = useLoginModalContext();
  const [gyms, setGyms] = useState([]);
  const [locGyms, setLocGyms] = useState([]);
  const [state, setState] = useState({
    center: {
      lat: 37.5033532547808,
      lng: 127.049875769645,
    },
    errMsg: null,
    isLoading: true,
  });
  const location = useLocation();
  const [filter, setFilter] = useState(
    location.state ? location.state.filter : "general"
  );
  const [userLocation, setUserLocation] = useState(
    sessionStorage.getItem("isLoggedIn") && userData
      ? userData.address.split(" ")[0] + " " + userData.address.split(" ")[1]
      : ""
  );
  const [map, setMap] = useState();
  const [useCurrentLoc, setUseCurrentLoc] = useState(false);
  const [coords, setCoords] = useState([]);

  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const gymData = await getGymResList();
        console.log("파트너 헬스장 리스트: ", gymData);
        setGyms(gymData);
      } catch (error) {
        console.error("Error fetching gym list:", error);
      }
    };

    fetchGyms();
  }, []);

  useEffect(() => {
    const fetchLocGyms = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            // 좌표를 주소로 변환
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.coord2Address(
              longitude,
              latitude,
              async (result, status) => {
                if (status === kakao.maps.services.Status.OK) {
                  const addr =
                    result[0].address.region_1depth_name +
                    " " +
                    result[0].address.region_2depth_name;
                  setUserLocation(addr);

                  // 변환된 주소로 근처 헬스장 정보 가져오기
                  try {
                    const gymData = await getGymResListByLocation(addr);
                    setLocGyms(gymData);
                    console.log("주변 헬스장 리스트:", gymData);
                  } catch (error) {
                    console.error("Error fetching nearby gyms:", error);
                  }
                }
              }
            );
          },
          (err) => {
            console.error("Error getting current position:", err);
          }
        );
      }
    };

    fetchLocGyms();
  }, []);

  const [events, setEvents] = useState(getInitialEvents());

  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) =>
      event.id === info.event.id ? { ...event, start: info.event.start } : event
    );
    setEvents(updatedEvents);
  };

  const customTitleFormat = ({ date }) => {
    return format(date.marker, "yyyy년 M월", { locale: ko });
  };

  return (
    <>
      {/* section 2 */}
      <div
        className={`snap-start h-[100dvh] w-full flex justify-evenly items-center text-xl text-white bg-light-black`}
      >
        {/* right */}
        <div className="flex flex-col gap-14 w-max relative">
          <span className="font-bold text-3xl">
            직접 가서 상담하기 너무 귀찮아..
          </span>
          <div className="flex flex-col gap-6">
            <span>'득근'에서 그 귀찮음을 해결하세요!</span>
            <div className="relative">
              <span>헬스장 조회로 간편하게 알아보고,</span>
              <div className="absolute  left-[220px]">
                <img className="h-3 w-20" src={underline} alt="underline" />
              </div>
            </div>
            <div className="relative">
              <span>채팅으로 상담하고 온라인으로 결제하고!</span>
              <div className="absolute  left-[86px]">
                <img className="h-3 w-20" src={underline} alt="underline" />
              </div>
              <div className="absolute  left-[280px]">
                <img className="h-3 w-20" src={underline} alt="underline" />
              </div>
            </div>
          </div>
          <div className="relative w-fit">
            <Button
              label={"하루라도 빨리 근성장하기"}
              className={"text-black font-bold"}
              color="bright-orange"
              width="300px"
              height="76px"
              onClick={() => customNavigate("/gymSearch")}
            />
            <span className="absolute text-5xl -right-5 -top-4 ">🏋️</span>
          </div>
        </div>
        {/* left */}
        <div className="w-1/3 h-1/3 relative">
          <Slider
            dots={false}
            infinite={true}
            arrows={true}
            speed={500}
            slidesToShow={1}
            slidesToScroll={1}
            adaptiveHeight={true}
            // prevArrow={<CustomPrevArrow />}
            // nextArrow={<CustomNextArrow />}
          >
            {/* 현재 위치 활성화 돼있으면 */}
            {locGyms.length > 0
              ? locGyms.map((locGym, index) => (
                  <div
                    key={locGym.gymId || index}
                    className="relative w-[800px] h-[494px] group"
                    onClick={() =>
                      customNavigate("/gymSearch", {
                        state: { searchWord: locGym.userName },
                      })
                    }
                  >
                    <div className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col gap-8 justify-center items-center z-20 cursor-pointer transition-all ease-in-out">
                      <span>{locGym.userName}💪</span>
                      {locGym.operatingHours && (
                        <div className="flex items-center gap-2">
                          <box-icon
                            type="solid"
                            color="#FFF"
                            name="time-five"
                          ></box-icon>
                          <span>{locGym.operatingHours}</span>
                        </div>
                      )}

                      <span>{locGym.address + " " + locGym.detailAddress}</span>
                    </div>
                    {locGym.uploadFileName &&
                    locGym.uploadFileName.length > 0 ? (
                      <img
                        src={
                          locGym.uploadFileName.length > 0
                            ? `/images/${locGym.uploadFileName[0]}`
                            : "/path/to/default-image.jpg"
                        }
                        alt={`${locGym.gymName || "Gym"} image`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="flex flex-col gap-10 justify-center items-center w-full h-full border border-grayish-red rounded-md bg-white text-black">
                        <span className="text-4xl">😔</span>
                        <span className="text-xl">등록된 사진이 없습니다</span>
                      </div>
                    )}
                  </div>
                ))
              : // 현재 위치 활성화 안돼있으면
                gyms.map((gym, index) => (
                  <div
                    key={gym.gymId || index}
                    className="relative w-[800px] h-[494px] group"
                    onClick={() =>
                      customNavigate("/gymSearch", {
                        state: { searchWord: gym.userName },
                      })
                    }
                  >
                    <div className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 w-full h-full bg-black/80 flex flex-col gap-8 justify-center items-center z-20 cursor-pointer transition-all ease-in-out">
                      <span>{gym.userName}💪</span>
                      {gym.operatingHours && (
                        <div className="flex items-center gap-2">
                          <box-icon
                            type="solid"
                            color="#FFF"
                            name="time-five"
                          ></box-icon>
                          <span>{gym.operatingHours}</span>
                        </div>
                      )}

                      <span>{gym.address + " " + gym.detailAddress}</span>
                    </div>
                    {gym.uploadFileName && gym.uploadFileName.length > 0 ? (
                      <img
                        src={
                          gym.uploadFileName.length > 0
                            ? `/images/${gym.uploadFileName[0]}`
                            : "/path/to/default-image.jpg"
                        }
                        alt={`${gym.gymName || "Gym"} image`}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="flex flex-col gap-10 justify-center items-center w-full h-full border border-grayish-red rounded-md bg-white text-black">
                        <span className="text-4xl">😔</span>
                        <span className="text-xl">등록된 사진이 없습니다</span>
                      </div>
                    )}
                  </div>
                ))}
          </Slider>
        </div>
      </div>
      {/* end of section 2 */}

      {/* section 1 */}
      <div
        className={`snap-start h-[100dvh] w-full flex flex-row-reverse  justify-evenly items-center gap-4 text-xl`}
      >
        {/* left */}
        <div className="flex flex-col  gap-14 w-max relative">
          <span className="font-bold text-3xl">인바디 결과, 믿으시나요?</span>
          <div className="flex flex-col  gap-6">
            <span>인바디 결과에 연연해 하지마세요!</span>
            <div className="relative">
              <span>인바디는 수분에 민감한 기계로, 결과가 부정확합니다.</span>
              <div className="absolute  left-[358px]">
                <img
                  className="h-3 w-16"
                  src={orangeUnderline}
                  alt="underline"
                />
              </div>
            </div>
            <div className="relative">
              <span>
                본인의 근성장을 확실하게 하기 위해 ‘득근’의 <b>운동일지</b>를
                활용해 보세요!
              </span>
              <div className="absolute  left-16">
                <img
                  className="h-3 w-16"
                  src={orangeUnderline}
                  alt="underline"
                />
              </div>
              <div className="absolute  left-[410px]">
                <img
                  className="h-3 w-20"
                  src={orangeUnderline}
                  alt="underline"
                />
              </div>
            </div>
          </div>
          <div className="relative w-fit">
            <Button
              label={"근성장 기록하기"}
              className={"text-black font-bold"}
              color="bright-orange"
              width="200px"
              height="76px"
              onClick={() =>
                sessionStorage.getItem("isLoggedIn")
                  ? customNavigate("/calendar")
                  : toggleLoginModal()
              }
            />
            <span className="absolute text-4xl -right-3 -top-4">✏️</span>
          </div>
        </div>
        {/* right */}
        <div className="xl:w-1/2 lg:w-[60vw] h-2/3 relative bg-white py-5 px-10 rounded-md shadow-md">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={"dayGridMonth"}
            titleFormat={(date) => customTitleFormat(date)}
            headerToolbar={{
              start: "",
              center: "",
              end: "",
            }}
            footerToolbar={{
              start: "",
              center: "",
              end: "",
            }}
            eventDisplay={"block"}
            editable={true}
            weekends={true}
            events={events}
            selectable={true}
            eventDrop={handleEventDrop}
            eventTimeFormat={{ hour: "2-digit", minute: "2-digit" }}
            height={"100%"}
          />
        </div>
      </div>
      {/* end of section 1 */}

      {/* section 3 */}
      <div
        className={`snap-start h-[100dvh] w-full flex justify-evenly items-center bg-light-black text-white text-xl`}
      >
        {/* right */}
        <div className="flex flex-col gap-14 w-max relative">
          <div className="relative">
            <span className="font-bold text-3xl">헬스장을 운영하시나요?</span>
            <div className="absolute  left-[130px]">
              <img className="h-3 w-16" src={underline} alt="underline" />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <span>‘득근’이 도와드릴게요!</span>
            <div className="relative">
              <span>회원 통계, PT 캘린더 등 유용한 기능으로</span>
              <div className="absolute  left-[220px]">
                <img className="h-2 w-28" src={underline} alt="underline" />
              </div>
            </div>
            <div className="relative">
              <span>회원권 및 데이터를 관리하고</span>
              <div className="absolute  left-[180px]">
                <img className="h-3 w-20" src={underline} alt="underline" />
              </div>
            </div>
            <div className="relative">
              <span>센터에 꼭 맞는 프로모션과 PT 커리큘럼을 만들어보세요</span>
              <div className="absolute  left-[66px]">
                <img className="h-3 w-[70px]" src={underline} alt="underline" />
              </div>
            </div>
          </div>
          <div className="relative w-fit">
            <Button
              label={"헬스장 대박나기"}
              className={"text-black font-bold"}
              color="bright-orange"
              width="250px"
              height="76px"
              // TODO 헬스장 회원인지 확인
              onClick={() =>
                sessionStorage.getItem("isLoggedIn")
                  ? customNavigate("/stats")
                  : toggleLoginModal()
              }
            />
            <span className="absolute text-5xl -right-5 -top-4 ">👍</span>
          </div>
        </div>
        {/* left */}
        <div className="w-1/2 h-2/3 relative rounded-xl overflow-hidden bg-white p-10 shadow-md">
          <ChartDemo />
        </div>
      </div>
      {/* end of section 3 */}

      {/* section 4 */}
      <div
        className={`snap-start h-[100dvh] w-full flex flex-col justify-evenly items-center text-xl`}
      >
        <div className="flex justify-center items-center gap-4 relative">
          <span className="text-5xl">💪</span>
          <span className="font-bold text-4xl">'득근'의 파트너 헬스장</span>
          <div className="absolute -bottom-3 left-[220px]">
            <img className="h-4 w-28" src={orangeUnderline} alt="underline" />
          </div>
        </div>
        {/* TODO 헬스장 불러와서 사진 표시하기 */}
        <div className="w-full h-[340px] relative">
          <Slider
            dots={false}
            infinite={true}
            autoplay={true}
            speed={500}
            slidesToShow={5}
            slidesToScroll={1}
            adaptiveHeight={true}
            centerMode={true} // Added to center active slide
            // centerPadding="60px"
            // className="flex items-center"
            // prevArrow={<CustomPrevArrow />}
            // nextArrow={<CustomNextArrow />}
          >
            {gyms.map(
              (gym, index) =>
                gym.uploadFileName &&
                gym.uploadFileName.length > 0 && (
                  <div
                    key={gym.gymId || index}
                    className="relative flex justify-center items-center h-[340px] w-[340px] group"
                  >
                    <div className="group-hover:opacity-100 opacity-0 absolute top-0 left-0 rounded-full h-[340px] w-[340px] bg-black/80 flex flex-col gap-8 justify-center items-center z-20 cursor-pointer transition-all ease-in-out  text-white">
                      <span>{gym.userName}🔥</span>
                      {/* {gym.operatingHours && (
                        <div className="flex items-center gap-2">
                          <box-icon
                            type="solid"
                            color="#FFF"
                            name="time-five"
                          ></box-icon>
                          <span>{gym.operatingHours}</span>
                        </div>
                      )}

                      <span>{gym.address + " " + gym.detailAddress}</span> */}
                    </div>
                    <img
                      src={`/images/${gym.uploadFileName[0]}`}
                      alt={`${gym.gymName || "Gym"} image`}
                      className="border bg-gray-300 rounded-full h-[340px] w-[340px] object-cover"
                    />
                  </div>
                )
            )}
          </Slider>
        </div>
        {/* <div className="flex justify-between items-end gap-12 overflow-hidden">
          <div className="border bg-gray-300 rounded-full w-[510px] h-[340px]"></div>
          <div className="border bg-gray-300 rounded-full w-[600px] h-[400px]"></div>
          <div className="border bg-gray-300 rounded-full w-[510px] h-[340px]"></div>
        </div> */}
        <div className="relative flex gap-4 justify-center items-center">
          <div>
            <span className="font-bold text-3xl">사장님도 '득근'하세요!</span>
            <div className="absolute left-[136px]">
              <img className="h-3 w-16" src={orangeUnderline} alt="underline" />
            </div>
          </div>
          <Button
            label={"득근하기"}
            className={"text-black font-bold"}
            color="bright-orange"
            width="160px"
            height="76px"
            // TODO 헬스장 회원인지 확인
            onClick={() =>
              sessionStorage.getItem("isLoggedIn")
                ? customNavigate("/stats")
                : customNavigate("/signUp/form", { state: { role: "gym" } })
            }
          />
          <span className="absolute text-5xl -right-5 -top-4 ">🤝</span>
        </div>
      </div>
      {/* end of section 4 */}
    </>
  );
};

export default Section;
