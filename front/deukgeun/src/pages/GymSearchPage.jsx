import React, { useEffect, useRef, useState } from "react";
import Map from "../components/GymSearchMap";
const { kakao } = window;

const GymSearchPage = () => {
  console.log("짐서치 화면 들어옴");
  return (
    <>
      <Map />
    </>
  );
};

export default GymSearchPage;
