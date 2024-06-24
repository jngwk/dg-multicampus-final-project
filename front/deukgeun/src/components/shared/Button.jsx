import React from "react";

const Button = ({
  label, // 버튼 이름
  height = "44px", // 높이
  width = "240px", // 너비
  color = "peach-fuzz", // 버튼 색깔
  name = "",
  onClick, // onClick 함수
  className, // 추가 스타일
}) => {
  const backgroundColorClass = {
    "peach-fuzz": "bg-peach-fuzz",
    "bright-orange": "bg-bright-orange",
    gray: "bg-gray-300",
  }[color];
  return (
    <button
      onClick={onClick}
      style={{ height, width }}
      name={name}
      className={`${className} ${backgroundColorClass} rounded-lg my-[2px] hover:ring-2 hover:ring-gray-400`}
    >
      {label}
    </button>
  );
};

export default Button;
