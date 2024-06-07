import React from "react";

const Button = ({
  label,
  height = "44px",
  width = "240px",
  color = "peach-fuzz",
  name = "",
  onClick,
  className,
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
      className={`${className} ${backgroundColorClass} rounded-lg my-[2px] font-medium hover:ring-2 hover:ring-gray-400`}
    >
      {label}
    </button>
  );
};

export default Button;
