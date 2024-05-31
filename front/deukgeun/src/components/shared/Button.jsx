import React from "react";

const Button = ({
  label,
  height = "44px",
  width = "240px",
  color = "peach-fuzz",
  onClick,
}) => {
  const backgroundColorClass = {
    "peach-fuzz": "bg-peach-fuzz",
    "bright-orange": "bg-bright-orange",
  }[color];
  return (
    <button
      onClick={onClick}
      style={{ height, width }}
      className={`${backgroundColorClass} rounded-lg my-[2px] font-medium hover:ring-2 hover:ring-gray-400`}
    >
      {label}
    </button>
  );
};

export default Button;
