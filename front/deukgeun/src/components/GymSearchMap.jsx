import React, { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Input from "../components/shared/Input";
import { getGymList, searchGyms, GymInfo } from "../api/gymApi";
import { Scrollbar } from "react-scrollbars-custom";
import useCustomNavigate from "../hooks/useCustomNavigate";
import ChatModal from "./modals/ChatModal";
import { useLocation } from "react-router-dom";
import { useLoginModalContext } from "../context/LoginModalContext";
import { useAuth } from "../context/AuthContext";
const { kakao } = window;

const GymSearchMap = () => {
  const [state, setState] = useState({
    center: {
      lat: 33.450701,
      lng: 126.570667,
    },
    errMsg: null,
    isLoading: true,
  });
  const location = useLocation();
  const [filter, setFilter] = useState(
    location.state ? location.state.filter : "default"
  );
  const [searchWord, setSearchWord] = useState(
    location.state ? location.state.searchWord : ""
  );
  const [coords, setCoords] = useState([]);
  const [map, setMap] = useState();
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState([]);
  const [useCurrentLoc, setUseCurrentLoc] = useState(false);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const { toggleLoginModal } = useLoginModalContext();
  const customNavigate = useCustomNavigate();
  // const { userData } = useAuth();

  useEffect(() => {
    // 현재 위치 지도 표시
    if (navigator.geolocation) {
      setUseCurrentLoc(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
  }, [sessionStorage.getItem("isLoggedIn")]);

  // useEffect(async () => {
  //   // handleSearch -> keyWord + filter -> search
  //   if (filter === "location") {
  //     try {
  //       const res = await searchGyms(
  //         userData.address.split(" ")[0] + " " + userData.address.split(" ")[1]
  //       );
  //       // console.log("handleSearch in gym search map", res);
  //       handleLoadedGyms(res);
  //     } catch (error) {
  //       console.error("Error fetching gym list:", error);
  //     }
  //   } else if (filter === "hours") {
  //   } else if (filter === "price") {
  //   }
  // }, [filter]);

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
    return new Promise((resolve, reject) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          resolve({ lat: result[0].y, lng: result[0].x });
        } else {
          reject(new Error("Failed to convert address to lat/lng"));
        }
      });
    });
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

  // TODO 등록된 헬스장도 같이 검색하기
  const handleSearch = async () => {
    if (!searchWord) return;
    try {
      const res = await searchGyms(searchWord);
      // console.log("handleSearch in gym search map", res);
      handleLoadedGyms(res);
    } catch (error) {
      console.error("Error fetching gym list:", error);
    }
  };

  const handleLoadedGyms = async (res) => {
    const newCoords = [];
    if (res.length > 0) {
      setGyms(res);
      const promises = res.map(async (gym) => {
        try {
          const latlng = await convertAddressToLatLng(
            gym.address + " " + gym.detailAddress
          );
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
        console.log("@@@@ results", results);
        setState((prev) => ({
          ...prev,
          center: { lat: results[0].latlng.lat, lng: results[0].latlng.lng },
        }));
      }
      results.forEach((result, index) => {
        if (index === 0 && !useCurrentLoc) {
          console.log("@@@@@@@", result, index);
          setState((prev) => ({
            ...prev,
            center: { lat: result.latlng.lat, lng: result.latlng.lng },
          }));
        }
        if (result) {
          newCoords.push(result);
        }
      });

      setCoords(newCoords);
      console.log(newCoords);
    } else {
      setGyms();
    }
  };

  const handleListClick = async (gym) => {
    console.log(gym);
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

  const handleFilterClick = (e) => {
    setFilter(e.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };
  const handleRegister = async (gym) => {
    try {
      const data = await GymInfo(gym.gymId); // Fetch complete gym data
      customNavigate("/memberregister", { state: { gym: data } });
    } catch (error) {
      console.error("Error fetching gym data:", error);
    }
  };

  // const handleAlertModalButton = () => {
  //   setIsAlertModalVisible(false);
  //   setIsChatModalVisible(false);
  // };

  const handleRegistertButton = () => {};
  return (
    <div className="relative w-full h-full">
      <Map
        id="map"
        className="relative z-10"
        center={state.center}
        style={{
          width: "100%",
          height: "80dvh",
        }}
        level={4}
        onCreate={setMap}
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
      <div className="absolute top-0 left-0 z-20  w-[400px] h-full flex justify-center items-center">
        <div className="flex flex-col items-center h-[90%] w-5/6 bg-white/90 rounded-md py-2 border border-grayish-red shadow-xl">
          <div className="w-full flex flex-col items-center border-b-2 pb-2">
            {/* TODO 필터 적용하기 */}
            <select
              name="filter"
              id="filter"
              className="bg-transparent w-[90%] text-sm text-center px-3 outline-none rounded-md focus:border-2 focus:border-peach-fuzz active:border-peach-fuzz"
            >
              <option onClick={(e) => handleFilterClick(e)} value="default">
                필터를 선택해주세요
              </option>
              <option onClick={(e) => handleFilterClick(e)} value="location">
                내 위치에서 가까운
              </option>
              <option onClick={(e) => handleFilterClick(e)} value="price">
                회원권 가격이 저렴한
              </option>
              <option onClick={(e) => handleFilterClick(e)} value="hours">
                24시간 운영하는
              </option>
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
                    <span className="text-sm">
                      {gym.operatingHours || "24시간 운영"}
                    </span>
                    <span className="text-ellipsis overflow-hidden text-sm">
                      {gym.address}
                    </span>
                    <div className="flex justify-evenly mt-3">
                      <button
                        className="border border-gray-500 py-2 px-4 text-xs rounded-md bg-grayish-red/30 hover:border-grayish-red hover:bg-grayish-red hover:text-white transition-all"
                        onClick={() =>
                          customNavigate("/centerView", { state: { gym: gym } })
                        }
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
    </div>
  );
};

export default GymSearchMap;
