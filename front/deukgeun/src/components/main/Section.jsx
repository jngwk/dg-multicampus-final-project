import React, {useState, useEffect} from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Button from "../shared/Button";
import underline from "../../assets/curved-underline.png";
import orangeUnderline from "../../assets/curved-underline-orange.png";
import useCustomNavigate from "../../hooks/useCustomNavigate";
import { useLoginModalContext } from "../../context/LoginModalContext";
import Slider from "@ant-design/react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import calendarDemo from "../../assets/calendar-demo.webp";
import { getGymResList, getGymResListByLocation } from "../../api/gymApi";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import healthImage1 from "../../assets/healthImage1.jpg"

import healthImage2 from "../../assets/healthImage2.jpg";
import healthImage3 from "../../assets/healthImage3.jpg";
import healthImage4 from "../../assets/healthImage4.jpg";
import healthImage5 from "../../assets/healthImage5.jpg";

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
        console.log(gymData);
        setGyms(gymData);
      } catch (error) {
        console.error("Error fetching gym list:", error);
      }
    };

    fetchGyms();
  }, []);
  
  // //위치가 가까운 헬스장을 받기위한 useEffect
  // useEffect(() => {
  //   const fetchLocGyms = async () => {
  //     if (navigator.geolocation) {
  //       setUseCurrentLoc(true);
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           // 현재 위치 주소를 저장
  //           // console.log("position", position);
  //           function searchDetailAddrFromCoords(coords, callback) {
  //             // 좌표로 법정동 상세 주소 정보를 요청
  //             const geocoder = new kakao.maps.services.Geocoder();
  //             geocoder.coord2Address(coords.longitude, coords.latitude, callback);
  //           }
  //           searchDetailAddrFromCoords(position.coords, (result, status) => {
  //             if (status === kakao.maps.services.Status.OK) {
  //               console.log(result);
  //               const addr =
  //                 result[0].address.region_1depth_name +
  //                 " " +
  //                 result[0].address.region_2depth_name;
  //               // console.log("addr", addr);
  //               setUserLocation(addr);
  //             }
  //           });
    
  //           // 지도 중앙을 현재 위치로 지정
  //           setState((prev) => ({
  //             ...prev,
  //             center: {
  //               lat: position.coords.latitude,
  //               lng: position.coords.longitude,
  //             },
  //             isLoading: false,
  //           }));
  //         },
  //         (err) => {
  //           setState((prev) => ({
  //             ...prev,
  //             errMsg: err.message,
  //             isLoading: false,
  //           }));
  //         }
  //       );
  //     } else {
  //       setState((prev) => ({
  //         ...prev,
  //         errMsg: "geolocation을 사용할수 없어요..",
  //         isLoading: false,
  //       }));
  //     }
  //     try {
  //       const gymData = await getGymResListByLocation();
  //       console.log(gymData);
  //       setLocGyms(gymData);
  //     } catch (error) {
  //       console.error("Error fetching gym list:", error);
  //     }
  //   };

  //   fetchLocGyms();
  // }, []);
  // const convertAddressToLatLng = (address) => {
  //   // console.log("address", address);
  //   return new Promise((resolve, reject) => {
  //     const geocoder = new kakao.maps.services.Geocoder();
  //     geocoder.addressSearch(address, function (result, status) {
  //       // console.log("result in convert address", result, status);
  //       if (status === kakao.maps.services.Status.OK) {
  //         // console.log("okay");
  //         resolve({ lat: result[0].y, lng: result[0].x });
  //       } else {
  //         reject(new Error("Failed to convert address to lat/lng"));
  //       }
  //     });
  //   });
  // };

  // const moveToCurrentLoc = async () => {
  //   // if geocoder is available move the user to the current location
  //   // if not, convert 'userLocation' to lat lang and move to that position
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const { latitude, longitude } = position.coords;
  //         map.panTo(new kakao.maps.LatLng(latitude, longitude));
  //       },
  //       (err) => {
  //         console.error("Error getting current position:", err);
  //       }
  //     );
  //   } else {
  //     try {
  //       const latlng = await convertAddressToLatLng(userLocation);
  //       map.panTo(new kakao.maps.LatLng(latlng.lat, latlng.lng));
  //     } catch (error) {
  //       console.error("Error converting address to lat/lng:", error);
  //     }
  //   }
  // };


  return (
    <>
      {/* section 2 */}
      <div
        className={`snap-start h-[100dvh] w-full flex justify-center items-center gap-52 text-xl text-white bg-light-black`}
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
        <div className="w-1/3 h-[400px] relative">
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
            {/* {locGyms.map((locGym, index) => (
              <div key={locGym.gymId || index}>
                <img
                  src={locGym.uploadFileName && locGym.uploadFileName.length > 0 
                    ? `/images/${locGym.uploadFileName[0]}` 
                    : "/path/to/default-image.jpg"}
                  alt={`${locGym.gymName || 'Gym'} image`}
                  className="border bg-gray-300 h-[400px] object-cover"
                />
              </div>
            ))} */}
            <div>
            <img
            className="rounded-lg object-cover shadow-lg w-[495] h-[400]"
            src={healthImage1}
          />
            </div>
            <div>
            <img
            className="rounded-lg object-cover shadow-lg w-[495] h-[400] "
            src={healthImage2}
          />
            </div>
            <div>
            <img
            className="rounded-lg object-cover shadow-lg w-[495] h-[400]"
            src={healthImage3}
          />
            </div>
            <div>
            <img
            className="=rounded-lg object-cover shadow-lg w-[495] h-[400] "
            src={healthImage4}
          />
            </div>
            <div>
            <img
            className="rounded-lg object-cover shadow-lg w-[495] h-[400]"
            src={healthImage5}
          />
            </div>
            
          </Slider>
        </div>
      </div>
      {/* end of section 2 */}

      {/* section 1 */}
      <div
        className={`snap-start h-[100dvh] w-full flex flex-row-reverse  justify-center items-center gap-4 text-xl`}
      >
        {/* left */}
        <div className="flex flex-col gap-14 w-max relative">
          <span className="font-bold text-3xl">인바디 결과, 믿으시나요?</span>
          <div className="flex flex-col gap-6">
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
        <div className="w-1/3 relative">이미지</div>
      </div>
      {/* end of section 1 */}

      {/* section 3 */}
      <div
        className={`snap-start h-[100dvh] w-full flex justify-center items-center gap-4 bg-light-black text-white text-xl`}
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
        <div className="w-1/3 relative rounded-xl overflow-hidden"></div>
      </div>
      {/* end of section 3 */}

      {/* section 4 */}
      <div
        className={`snap-start h-[100dvh] w-full flex flex-col gap-60 justify-center items-center text-xl`}
      >
        <div className="flex justify-center items-center gap-4 relative">
          <span className="text-5xl">💪</span>
          <span className="font-bold text-4xl">'득근'의 파트너 헬스장</span>
          <div className="absolute -bottom-3 left-[220px]">
            <img className="h-4 w-28" src={orangeUnderline} alt="underline" />
          </div>
        </div>
        {/* TODO 헬스장 불러와서 사진 표시하기 */}
        <div className="w-full h-[340px] relative overflow-hidden">
          <Slider
            dots={false}
            infinite={true}
            autoplay={true}
            speed={500}
            slidesToShow={5}
            slidesToScroll={1}
            adaptiveHeight={true}
            // prevArrow={<CustomPrevArrow />}
            // nextArrow={<CustomNextArrow />}
          >
            {gyms.map((gym, index) => (
              <div key={gym.gymId || index}>
                <img
                  src={gym.uploadFileName && gym.uploadFileName.length > 0 
                    ? `/images/${gym.uploadFileName[0]}` 
                    : "/path/to/default-image.jpg"}
                  alt={`${gym.gymName || 'Gym'} image`}
                  className="border bg-gray-300 rounded-full h-[340px] w-[340px] object-cover"
                />
              </div>
            ))}
          </Slider>
        </div>
        {/* <div className="flex justify-between items-end gap-12 overflow-hidden">
          <div className="border bg-gray-300 rounded-full w-[510px] h-[340px]"></div>
          <div className="border bg-gray-300 rounded-full w-[600px] h-[400px]"></div>
          <div className="border bg-gray-300 rounded-full w-[510px] h-[340px]"></div>
        </div> */}
        <div className="relative flex gap-6 justify-center items-center">
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
