import React, { useState } from "react";
import Input from "../shared/Input";
import Filter from "./Filter";
import CustomParticles from "../shared/CustomParticles";

const Hero = () => {
  const [filter, setFilter] = useState("price");

  const handleSearchButton = () => {
    // TODO 필터 적용한 검색 기능 구현
  };

  return (
    <>
      <CustomParticles />
      <div className="w-full h-[60dvh] flex justify-center items-center">
        <div className="flex flex-col gap-11">
          {/* 가격 필터 */}
          <Filter
            label={"가격이 저렴한"}
            emoji={"💳"}
            underlineWidth={"140px"}
          />
          {/*  */}
          {/* 위치 필터 */}
          {/* 위치 필터 */}
          <Input
            width="400px"
            height="50px"
            placeholder="헬스장 검색하기"
            feature={
              <div>
                <box-icon name="search" color="#bdbdbd" size="s"></box-icon>
              </div>
            }
            featureEnableOnLoad={true}
          />
        </div>
      </div>
    </>
  );
};

export default Hero;
