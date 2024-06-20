import React, { useEffect, useState } from "react";
import { Map, MapMarker, useMap } from "react-kakao-maps-sdk";
import Input from "./shared/Input";
import { getGymList } from "../api/gymApi";
import Button from "./shared/Button";
import Select from "./shared/Select";
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

  useEffect(() => {
    getGyms();
    if (navigator.geolocation) {
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
  }, []);

  const getGyms = async () => {
    try {
      const res = await getGymList();
      const newCoords = [];

      if (res) {
        setGyms(res);
        const promises = res.map(async (gym) => {
          try {
            const latlng = await convertAddressToLatLng(
              gym.address + " " + gym.detailAddress
            );
            return {
              content: <div style={{ color: "#000" }}>{gym.user.userName}</div>,
              latlng: latlng,
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
        results.forEach((result) => {
          if (result) {
            newCoords.push(result);
          }
        });

        setCoords(newCoords);
        console.log(newCoords);
      }
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

  const EventMarkerContainer = ({ position, content }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
      <MapMarker
        position={position}
        onClick={(marker) => map.panTo(marker.getPosition())}
        onMouseOver={() => setIsVisible(true)}
        onMouseOut={() => setIsVisible(false)}
      >
        {isVisible && content}
      </MapMarker>
    );
  };

  // TODO 등록된 헬스장도 같이 검색하기
  const handleSearch = () => {
    const ps = new kakao.maps.services.Places();
    ps.keywordSearch(
      searchWord,
      (data, status, _pagination) => {
        if (status === kakao.maps.services.Status.OK) {
          // const bounds = new kakao.maps.LatLngBounds();
          const newCoords = [];

          for (let i = 0; i < data.length; i++) {
            newCoords.push({
              content: (
                <div style={{ color: "#000" }}>{data[i].place_name}</div>
              ),
              latlng: { lat: data[i].y, lng: data[i].x },
            });
            // bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
          }
          setCoords(newCoords);
          // map.setBounds(bounds);
        }
      },
      { useMapCenter: true }
    );
  };

  const handleListClick = async (gym) => {
    console.log(gym);
    try {
      const latlng = await convertAddressToLatLng(
        gym.address + " " + gym.detailAddress
      );
      map.panTo(new kakao.maps.LatLng(latlng.lat, latlng.lng));
    } catch (error) {
      console.error(error);
    }
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
              />
            ))}
          </>
        )}
      </Map>
      <div className="absolute top-0 left-0 z-20  w-[320px] h-full flex justify-center items-center">
        <div className="flex flex-col items-center h-[90%] w-5/6 bg-gray-50/90 rounded-md py-2 border border-grayish-red shadow-xl">
          <div className="w-full flex flex-col items-center border-b-2 pb-2">
            {/* TODO 필터 적용하기 */}
            <select
              name="filter"
              id="filter"
              className="bg-transparent w-[240px] text-sm"
            >
              <option value="currentLoc">내 위치에서 가까운</option>
              <option value="currentLoc">회원권 가격이 저렴한</option>
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
            />
            <Button label="검색하기" onClick={handleSearch} width="90%" />
            {/* <Select label="필터">
              <>
                <option value="currentLoc">내 위치에서 가까운</option>
                <option value="currentLoc">회원권 가격이 저렴한</option>
              </>
            </Select> */}
          </div>
          <div className="flex flex-col items-center w-[90%]">
            {gyms
              ? gyms.map((gym, i) => (
                  <div
                    key={i}
                    className="flex flex-col w-[240px] border-b-2 mt-1 h-[50px] cursor-pointer hover:bg-peach-fuzz/10"
                    onClick={() => handleListClick(gym)}
                  >
                    <span>{gym.user.userName}</span>
                    <span className="text-ellipsis overflow-hidden text-sm">
                      {gym.address}
                    </span>
                    {/* <div className="flex justify-between">
                      <span>상세보기</span>
                      <span>문의하기</span>
                    </div> */}
                  </div>
                ))
              : "일치하는 헬스장이 없습니다."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GymSearchMap;
