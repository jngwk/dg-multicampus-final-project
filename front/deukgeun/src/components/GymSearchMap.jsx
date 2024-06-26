import React, { useEffect, useState } from "react";
import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import TextArea from "../components/shared/TextArea";
import Input from "../components/shared/Input";
import Button from "../components/shared/Button";
import { getGymList, searchGyms } from "../api/gymApi";
import { Scrollbar } from "react-scrollbars-custom";
import useCustomNavigate from "../hooks/useCustomNavigate";
import ModalLayout from "./modals/ModalLayout";
import useChat from "../hooks/useChat";
import AlertModal from "./modals/AlertModal";
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
  const [searchWord, setSearchWord] = useState("");
  const [coords, setCoords] = useState([]);
  const [map, setMap] = useState();
  const [gyms, setGyms] = useState([]);
  const [selectedGym, setSelectedGym] = useState([]);
  const [useCurrentLoc, setUseCurrentLoc] = useState(false);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const { chatMessage, setChatMessage, sendMessageHttp, findOrCreateChatRoom } =
    useChat();
  const customNavigate = useCustomNavigate();

  useEffect(() => {
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
    getGyms();
  }, []);

  const getGyms = async () => {
    try {
      const res = await getGymList();
      handleLoadedGyms(res);
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
      handleLoadedGyms(res);
    } catch (error) {
      console.error("Error fetching gym list:", error);
    }

    // const ps = new kakao.maps.services.Places();
    // ps.keywordSearch(
    //   searchWord,
    //   (data, status, _pagination) => {
    //     if (status === kakao.maps.services.Status.OK) {
    //       // const bounds = new kakao.maps.LatLngBounds();
    //       const newCoords = [];

    //       for (let i = 0; i < data.length; i++) {
    //         newCoords.push({
    //           content: (
    //             <div style={{ color: "#000" }}>{data[i].place_name}</div>
    //           ),
    //           latlng: { lat: data[i].y, lng: data[i].x },
    //         });
    //         // bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
    //       }
    //       setCoords(newCoords);
    //       // map.setBounds(bounds);
    //     }
    //   },
    //   { useMapCenter: true }
    // );
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
        setState((prev) => ({
          ...prev,
          center: { lat: results.latlng.lat, lng: results.latlng.lng },
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

  const handleHideChatModal = () => {
    setSelectedGym();
    setIsChatModalVisible(false);
  };

  const handleSendButton = async () => {
    // 채팅 메시지 보내기
    try {
      const newChatRoom = await findOrCreateChatRoom(selectedGym.user.userId);
      console.log("newChatRoom", newChatRoom);
      if (newChatRoom) {
        const res = await sendMessageHttp(newChatRoom);
        console.log("sendMessageHttp res", res);
      }
      setIsAlertModalVisible(true);
    } catch (error) {
      console.error("error sending contact message", error);
    }
  };

  const handleAlertModalButton = () => {
    setIsAlertModalVisible(false);
    setIsChatModalVisible(false);
  };
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
              <option value="location">내 위치에서 가까운</option>
              <option value="price">회원권 가격이 저렴한</option>
              {/* <option value="currentLoc">내 위치에서 가장 가까운...</option>
              <option value="currentLoc">내 위치에서 가장 가까운...</option> */}
            </select>
            {/* TODO 검색 기능 추가 */}
            <Input
              name={"searchWord"}
              value={searchWord}
              placeholder="검색어를 입력하세요..."
              onChange={(e) => setSearchWord(e.target.value)}
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
                      <button className="border border-gray-500 py-2 px-4 text-xs rounded-md bg-grayish-red/30 hover:border-grayish-red hover:bg-grayish-red hover:text-white transition-all">
                        상세보기
                      </button>
                      <button
                        className="border border-gray-500 py-2 px-4 text-xs rounded-md bg-grayish-red/30 hover:border-grayish-red hover:bg-grayish-red hover:text-white transition-all"
                        onClick={() => handleContactButton(gym)}
                      >
                        문의하기
                      </button>
                      <button className="border border-gray-500 py-2 px-4 text-xs text-gray-800 rounded-md bg-bright-orange/50 hover:border-bright-orange/80 hover:bg-bright-orange/80 hover:text-white transition-all">
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
        <ModalLayout toggleModal={handleHideChatModal}>
          <div className="flex flex-col justify-center items-start gap-4">
            <div className="mb-2">
              <span className="text-3xl">헬스장 문의 🙋</span>
            </div>
            <div className=" flex flex-col justify-center text-lg gap-2">
              <span>💪 {selectedGym.user.userName}</span>
              <p className="before:content-['*'] before:text-red-500 text-sm text-gray-500">
                문의하신 내용 및 답변은 '대화방'에서 확인하실 수 있습니다
              </p>
              <TextArea
                label={"문의내용"}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
              />
            </div>
            <div className="flex justify-end items-center w-full">
              <Button
                label={"문의하기"}
                color="bright-orange"
                width="100px"
                height="50px"
                onClick={handleSendButton}
              />
            </div>
          </div>
        </ModalLayout>
      )}
      {isAlertModalVisible && (
        <AlertModal
          headerEmoji={"✅"}
          line1={"메시지 전송이 완료됐습니다!"}
          line2={"답변은 '대화방'에서 확인해주세요"}
          button1={{ label: "확인", onClick: handleAlertModalButton }}
          button2={{ label: "대화방", path: "/chat" }}
        />
      )}
    </div>
  );
};

export default GymSearchMap;
