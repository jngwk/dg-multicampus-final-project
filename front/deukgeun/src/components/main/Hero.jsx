import React, { useEffect, useState } from "react";
import Input from "../shared/Input";
import Filter from "./Filter";
import useCustomNavigate from "../../hooks/useCustomNavigate";

const Hero = () => {
  const filters = ["general", "location", "price", "hours"];
  const [filter, setFilter] = useState(filters[0]);
  const [searchWord, setSearchWord] = useState("");
  const customNavigate = useCustomNavigate();
  const [manualFilterChange, setManualFilterChange] = useState(false);

  useEffect(() => {
    if (!manualFilterChange) {
      const interval = setInterval(() => {
        handleFilterClick();
      }, 9000); // Change filter every 10 seconds

      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [filter, manualFilterChange]);

  const handleSearchButton = () => {
    // TODO 필터 적용한 검색 기능 구현
    customNavigate("/gymSearch", {
      state: { searchWord: searchWord, filter: filter },
    });
  };

  const handleFilterClick = () => {
    const currentIdx = filters.findIndex((f) => f === filter);
    setFilter(filters[(currentIdx + 1) % filters.length]);
  };

  const handleFilterButtonClick = (selectedFilter) => {
    setFilter(selectedFilter);
    if (!manualFilterChange) setManualFilterChange(true);
  };

  const handleSearchWordChange = (e) => {
    if (!manualFilterChange) setManualFilterChange(true);
    setSearchWord(e.target.value);
  };

  return (
    <div className="relative w-full h-[90dvh] flex justify-center items-center">
      <div className="h-[40%] w-[400px] flex flex-col items-start gap-11">
        <div
          // pointer-events-none
          className=" select-none self-start"
          onClick={handleFilterClick}
        >
          {/* 가격 필터 */}
          {filter === "general" && (
            <Filter
              label={"득근 파트너"}
              emoji={"💪"}
              // underlineWidth={"140px"}
            />
          )}
          {filter === "price" && (
            <Filter
              label={"회원권 가격이 저렴한"}
              emoji={"💳"}
              // underlineWidth={"140px"}
            />
          )}
          {/* 위치 필터 */}
          {filter === "location" && (
            <Filter
              label={"나한테 가까운"}
              emoji={"🚶"}
              rotated={false}
              // underlineWidth={"140px"}
            />
          )}
          {/* 위치 필터 */}
          {filter === "hours" && (
            <Filter
              label={"24시간 운영하는"}
              emoji={"🌃"}
              rotated={false}
              // underlineWidth={"140px"}
            />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Input
            width="400px"
            height="50px"
            placeholder="헬스장 검색하기"
            value={searchWord}
            onChange={handleSearchWordChange}
            feature={
              <div>
                <box-icon name="search" color="#bdbdbd" size="s"></box-icon>
              </div>
            }
            featureEnableOnLoad={true}
            featureOnClick={handleSearchButton}
          />
          <div className="flex justify-start gap-2 text-gray-600 px-3 text-sm">
            <span>필터 선택: </span>
            <span
              className="hover:underline hover:underline-offset-[3px] cursor-pointer hover:text-trueGray-800"
              onClick={() => handleFilterButtonClick("general")}
            >
              없음{" "}
            </span>
            {"·"}
            <span
              className="hover:underline hover:underline-offset-[3px] cursor-pointer hover:text-trueGray-800"
              onClick={() => handleFilterButtonClick("location")}
            >
              위치{" "}
            </span>
            {"·"}
            <span
              className="hover:underline hover:underline-offset-[3px] cursor-pointer hover:text-trueGray-800"
              onClick={() => handleFilterButtonClick("price")}
            >
              가격
            </span>
            {"·"}
            <span
              className="hover:underline hover:underline-offset-[3px] cursor-pointer hover:text-trueGray-800"
              onClick={() => handleFilterButtonClick("hours")}
            >
              24시간
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 flex flex-col justify-center items-center gap-3 opacity-70">
        <span className="text-grayish-red text-lg font-bold select-none">
          Scroll Down
        </span>
        <div className="animate-bounce">
          <box-icon size="lg" color="#9f8d8d" name="chevrons-down"></box-icon>
        </div>
      </div>
    </div>
  );
};

export default Hero;
