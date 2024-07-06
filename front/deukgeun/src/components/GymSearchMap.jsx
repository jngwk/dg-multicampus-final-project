import React, { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Input from "../components/shared/Input";
import {
  getGymList,
  searchGyms,
  GymInfo,
  getProductList,
  getTrainerList,
  getTrainersWithInfo,
} from "../api/gymApi";
import { Scrollbar } from "react-scrollbars-custom";
import useCustomNavigate from "../hooks/useCustomNavigate";
import ChatModal from "./modals/ChatModal";
import { useLocation } from "react-router-dom";
import { useLoginModalContext } from "../context/LoginModalContext";
import { useAuth } from "../context/AuthContext";
import Fallback from "./shared/Fallback";
import MemberRegisterModal from "./modals/MemberRegisterModal";
import MembershipPtSelectModal from "./modals/MembershipPtSelectModal";
const { kakao } = window;

const GymSearchMap = () => {
  const { userData } = useAuth();
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
  const [searchWord, setSearchWord] = useState(
    location.state ? location.state.searchWord : ""
  );
  const [userLocation, setUserLocation] = useState(
    sessionStorage.getItem("isLoggedIn") && userData
      ? userData.address.split(" ")[0] + " " + userData.address.split(" ")[1]
      : ""
  );
  const [coords, setCoords] = useState([]);
  const [map, setMap] = useState();
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState([]);
  const [useCurrentLoc, setUseCurrentLoc] = useState(false);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [isSelectModalVisible, setIsSelectModalVisible] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);
  const { toggleLoginModal } = useLoginModalContext();
  const customNavigate = useCustomNavigate();

  useEffect(() => {
    // console.log(userLocation);
    // 현재 위치 지도 표시
    if (mapLoading || !kakao) return;
    console.log(location.state);
    if (
      location.state &&
      (location.state.filter || location.state.searchWord)
    ) {
      handleSearch();
      return;
    }
    setFilter("general");
    if (navigator.geolocation) {
      setUseCurrentLoc(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // 현재 위치 주소를 저장
          // console.log("position", position);
          function searchDetailAddrFromCoords(coords, callback) {
            // 좌표로 법정동 상세 주소 정보를 요청
            const geocoder = new kakao.maps.services.Geocoder();
            geocoder.coord2Address(coords.longitude, coords.latitude, callback);
          }
          searchDetailAddrFromCoords(position.coords, (result, status) => {
            if (status === kakao.maps.services.Status.OK) {
              console.log(result);
              const addr =
                result[0].address.region_1depth_name +
                " " +
                result[0].address.region_2depth_name;
              // console.log("addr", addr);
              setUserLocation(addr);
            }
          });

          // 지도 중앙을 현재 위치로 지정
          setState((prev) => ({
            ...prev,
            center: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));
        },
        (err) => {
          setState((prev) => ({
            ...prev,
            errMsg: err.message,
            isLoading: false,
          }));
        }
      );
    } else {
      setState((prev) => ({
        ...prev,
        errMsg: "geolocation을 사용할수 없어요..",
        isLoading: false,
      }));
    }
    if (searchWord) {
      handleSearch();
    } else {
      console.log("지도에서 get Gyms");
      getGyms();
    }
  }, [mapLoading]);

  const getGyms = async () => {
    try {
      const res = await getGymList();
      handleLoadedGyms(res);
      console.log("getGyms 들어옴");
    } catch (error) {
      console.error("Error fetching gym list:", error);
    }
  };

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

  const moveToCurrentLoc = async () => {
    // if geocoder is available move the user to the current location
    // if not, convert 'userLocation' to lat lang and move to that position
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.panTo(new kakao.maps.LatLng(latitude, longitude));
        },
        (err) => {
          console.error("Error getting current position:", err);
        }
      );
    } else {
      try {
        const latlng = await convertAddressToLatLng(userLocation);
        map.panTo(new kakao.maps.LatLng(latlng.lat, latlng.lng));
      } catch (error) {
        console.error("Error converting address to lat/lng:", error);
      }
    }
  };

  const EventMarkerContainer = ({ position, content, gym }) => {
    return (
      <MapMarker
        position={position}
        onClick={(marker) => handleMarkerClick(marker, gym)}
      >
        {selectedGym === gym && content}
      </MapMarker>
    );
  };

  const handleMarkerClick = (marker, gym) => {
    map.panTo(marker.getPosition());
    setSelectedGym(gym);
  };

  const handleSearch = async (searchFilter = filter) => {
    console.log("handle search", searchFilter, filter);
    if (!searchWord && searchFilter === "general") {
      getGyms();
      return;
    }
    if (searchFilter === "location") {
      // 현재 위치로 이동하기
      moveToCurrentLoc();
    }

    try {
      const page = 0;
      const size = 100;
      console.log(searchWord, searchFilter, userLocation, page, size);
      const res = await searchGyms(
        searchWord,
        searchFilter,
        userLocation,
        page,
        size
      );
      // console.log("handleSearch in gym search map", res);
      handleLoadedGyms(res);
    } catch (error) {
      console.error("Error fetching gym list:", error);
    }
  };

  const handleFilterClick = (e) => {
    // console.log(e.target.value);
    setFilter(e.target.value);
    handleSearch(e.target.value);
  };

  const handleLoadedGyms = async (res) => {
    const newCoords = [];
    if (res.length > 0) {
      setGyms(res);
      const promises = res.map(async (gym) => {
        try {
          if (!gym.address) {
            console.error("no gym address");
            return;
          }
          const latlng = await convertAddressToLatLng(gym.address);
          return {
            // content
            content: (
              <>
                <div className="min-w-[150px] p-4">
                  <div className="text-center w-full">{gym.user.userName}</div>
                </div>
              </>
            ),
            latlng: latlng,
            gym: gym,
          };
        } catch (error) {
          console.error("Failed to convert address:", error);
          return null;
        }
      });

      const results = await Promise.all(promises);
      if (results.length === 1) {
        // console.log("@@@@ results", results);
        setState((prev) => ({
          ...prev,
          center: {
            lat: results[0]?.latlng?.lat,
            lng: results[0]?.latlng?.lng,
          },
          isLoading: false,
        }));
      }
      results.forEach((result, index) => {
        if (index === 0 && !useCurrentLoc) {
          // console.log("@@@@@@@", result, index);
          setState((prev) => ({
            ...prev,
            center: { lat: result.latlng.lat, lng: result.latlng.lng },
            isLoading: false,
          }));
        }
        if (result) {
          newCoords.push(result);
        }
      });

      setCoords(newCoords);
      setUseCurrentLoc(false);
      // console.log(newCoords);
    } else {
      setGyms();
    }
  };

  const handleListClick = async (gym) => {
    // console.log(gym);
    try {
      setSelectedGym(gym);
      const latlng = await convertAddressToLatLng(
        gym.address + " " + gym.detailAddress
      );
      map.panTo(new kakao.maps.LatLng(latlng.lat, latlng.lng));
    } catch (error) {
      console.error(error);
    }
  };

  const handleContactButton = (gym) => {
    // 선택한 헬스장 채팅 모달로 띄우기
    setSelectedGym(gym);
    setIsChatModalVisible(true);
  };

  const toggleChatModal = () => {
    if (isChatModalVisible) {
      setSelectedGym();
      setIsChatModalVisible(false);
    } else {
      setIsChatModalVisible(true);
    }
  };

  const handleCenterView = async (gym) => {
    try {
      const products = await getProductList(gym.gymId); // Fetch complete gym data
      const trainers = await getTrainersWithInfo(gym.gymId);
      const gymWithProducts = {
        ...gym,
        productList: products,
        trainerList: trainers,
      };
      setSelectedGym(gymWithProducts);
      // setIsSelectModalVisible(true);
      customNavigate("/centerView", { state: { gym: gymWithProducts } });
    } catch (error) {
      console.error("Error fetching gym data:", error);
    }
  };
  const handleRegister = async (gym) => {
    try {
      const products = await getProductList(gym.gymId); // Fetch complete gym data
      const trainers = await getTrainersWithInfo(gym.gymId);
      const gymWithProducts = {
        ...gym,
        productList: products,
        trainerList: trainers,
      };
      setSelectedGym(gymWithProducts);
      setIsSelectModalVisible(true);
      // customNavigate("/memberregister", { state: { gym: gymWithProducts } });
    } catch (error) {
      console.error("Error fetching gym data:", error);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // const handleAlertModalButton = () => {
  //   setIsAlertModalVisible(false);
  //   setIsChatModalVisible(false);
  // };

  return (
    <div className="relative w-full h-[80dvh]">
      <Map
        id="map"
        className="relative z-10"
        center={state.center}
        style={{
          width: "100%",
          height: "80dvh",
        }}
        level={4}
        onCreate={(map) => {
          setMap(map);
          setMapLoading(false);
        }}
        isPanto={true}
      >
        {!state.isLoading && (
          <>
            {coords.map((value) => (
              <EventMarkerContainer
                key={`EventMarkerContainer-${value.latlng.lat}-${value.latlng.lng}`}
                position={value.latlng}
                content={value.content}
                gym={value.gym}
              />
            ))}
          </>
        )}
      </Map>
      <div className="absolute top-0 left-0 z-20  w-1/4 h-full flex justify-center items-center">
        <div className="flex flex-col items-center justify-center h-[90%] min-w-[332px] w-[332px] bg-white/90 rounded-md py-2 border border-grayish-red shadow-xl">
          <div className="w-full flex flex-col items-center border-b-2 pb-2">
            <select
              name="filter"
              id="filter"
              onChange={(e) => handleFilterClick(e)}
              value={filter}
              className="bg-transparent w-[90%] text-sm text-center px-3 outline-none rounded-md focus:border-2 focus:border-peach-fuzz active:border-peach-fuzz"
            >
              <option value="general">필터를 선택해주세요</option>
              <option value="location">내 위치에서 가까운</option>
              <option value="price">회원권 가격이 저렴한</option>
              <option value="hours">24시간 운영하는</option>
              {/* <option value="currentLoc">내 위치에서 가장 가까운...</option> */}
            </select>
            {/* TODO 검색 기능 추가 */}
            <Input
              name={"searchWord"}
              value={searchWord}
              placeholder="검색어를 입력하세요..."
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyPress={handleKeyPress}
              width="90%"
              feature={
                <div className="-translate-y-1">
                  <box-icon name="search" color="#bdbdbd" size="s"></box-icon>
                </div>
              }
              featureEnableOnLoad={true}
              featureOnClick={handleSearch}
            />
            {/* <Button label="검색하기" onClick={handleSearch} width="90%" /> */}
            {/* <Select label="필터">
              <>
                <option value="currentLoc">내 위치에서 가까운</option>
                <option value="currentLoc">회원권 가격이 저렴한</option>
              </>
            </Select> */}
          </div>
          <Scrollbar>
            <div className="flex flex-col items-center w-full">
              {gyms ? (
                gyms.map((gym, i) => (
                  <div
                    key={i}
                    className={`flex flex-col w-full border-b-2 p-3 cursor-pointer hover:bg-peach-fuzz/50 transition-all ${
                      selectedGym === gym && "bg-peach-fuzz/30"
                    }`}
                    onClick={() => handleListClick(gym)}
                  >
                    <span className="text-blue-600">{gym.user.userName}</span>
                    <span className="text-sm">{gym.operatingHours || ""}</span>
                    {/* <span className="text-sm">{gym.operatingHours || ""}</span> */}
                    <span className="text-ellipsis overflow-hidden text-sm">
                      {gym.address}
                    </span>
                    <div className="flex justify-evenly mt-3">
                      {!sessionStorage.getItem("isLoggedIn") ||
                      userData?.role === "ROLE_GENERAL" ? (
                        <>
                          <button
                            className="border border-gray-500 py-2 px-4 text-xs rounded-md bg-grayish-red/30 hover:border-grayish-red hover:bg-grayish-red hover:text-white transition-all"
                            onClick={() => handleCenterView(gym)}
                          >
                            상세보기
                          </button>
                          <button
                            className="border border-gray-500 py-2 px-4 text-xs rounded-md bg-grayish-red/30 hover:border-grayish-red hover:bg-grayish-red hover:text-white transition-all"
                            onClick={() =>
                              sessionStorage.getItem("isLoggedIn")
                                ? handleContactButton(gym)
                                : toggleLoginModal()
                            }
                          >
                            문의하기
                          </button>
                          <button
                            className="border border-gray-500 py-2 px-4 text-xs text-gray-800 rounded-md bg-bright-orange/50 hover:border-bright-orange/80 hover:bg-bright-orange/80 hover:text-white transition-all"
                            onClick={() =>
                              sessionStorage.getItem("isLoggedIn")
                                ? handleRegister(gym)
                                : toggleLoginModal()
                            }
                          >
                            등록하기
                          </button>
                        </>
                      ) : (
                        <button
                          className="border border-gray-500 py-2 px-4 text-xs text-gray-800 rounded-md bg-bright-orange/50 hover:border-bright-orange/80 hover:bg-bright-orange/80 hover:text-white transition-all"
                          onClick={() => handleCenterView(gym)}
                        >
                          상세보기
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <span className="text-3xl pt-6">😔</span>
                  <span className="py-6">
                    검색어와 일치하는 헬스장이 없습니다.
                  </span>
                </>
              )}
            </div>
          </Scrollbar>
        </div>
      </div>
      {isChatModalVisible && sessionStorage.getItem("isLoggedIn") && (
        <ChatModal toggleModal={toggleChatModal} selectedGym={selectedGym} />
      )}
      {isSelectModalVisible && sessionStorage.getItem("isLoggedIn") && (
        <MembershipPtSelectModal
          toggleModal={() => setIsSelectModalVisible(false)}
          selectedGym={selectedGym}
        />
      )}
      {/* <MemberRegisterModal /> */}
    </div>
  );
};

export default GymSearchMap;
