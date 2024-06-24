import React, { useState } from "react";
import Input from "../shared/Input";
import Filter from "./Filter";
import useCustomNavigate from "../../hooks/useCustomNavigate";

const Hero = () => {
  const [filter, setFilter] = useState("location");
  const [searchWord, setSearchWord] = useState("");
  const customNavigate = useCustomNavigate();

  const handleSearchButton = () => {
    // TODO 필터 적용한 검색 기능 구현
    customNavigate("/gymSearch", {
      state: { searchWord: searchWord, filter: filter },
    });
  };

  return (
    <div className="relative w-full h-[90dvh] flex justify-center items-center">
      <div className="h-[40%] flex flex-col gap-11">
        {/* 가격 필터 */}
        {filter === "price" && (
          <Filter
            label={"가격이 저렴한"}
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
        <div className="flex flex-col gap-2">
          <Input
            width="400px"
            height="50px"
            placeholder="헬스장 검색하기"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
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
              onClick={() => setFilter("location")}
            >
              위치{" "}
            </span>
            {"·"}
            <span
              className="hover:underline hover:underline-offset-[3px] cursor-pointer hover:text-trueGray-800"
              onClick={() => setFilter("price")}
            >
              가격
            </span>
            {"·"}
            <span
              className="hover:underline hover:underline-offset-[3px] cursor-pointer hover:text-trueGray-800"
              onClick={() => setFilter("hours")}
            >
              24시간
            </span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 flex flex-col justify-center items-center gap-3 opacity-70">
        <span className="text-grayish-red text-lg font-bold">Scroll Down</span>
        <div className="animate-bounce">
          <box-icon size="lg" color="#9f8d8d" name="chevrons-down"></box-icon>
        </div>
      </div>
    </div>
  );
};

export default Hero;
