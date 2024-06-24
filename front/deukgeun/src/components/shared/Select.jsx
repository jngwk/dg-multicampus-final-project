import React, { useState } from "react";

export default function Select({
  label, // 이름
  className, // input element 추가 스타일
  height = "44px", // 높이
  width = "240px", // 너비
  required = false, // required
  error = "", // 에러 메세지 (빨간색으로 하단에 표시)
  message = "", // 메세지 (초록색으로 하단에 표시)
  children,
  ...props
}) {
  const [focus, setFocus] = useState(false);

  const handleFocus = () => setFocus(true);
  //   const handleBlur = () => setFocus(false);

  const handleOnClick = (e) => console.log(e.target.event);

  const getBorderColor = () => {
    if (error) return "border-red-500";
    if (message) return "border-green-400";
    return focus ? "border-peach-fuzz" : "border-gray-400";
  };

  const getLabelColor = () => {
    if (error) return "text-red-500";
    if (message) return "text-green-400";
    return focus ? "text-peach-fuzz" : "text-gray-400";
  };

  //   const getLabelPosition = () => {
  //     if (type === "time" || type === "date" || focus || value)
  //       return "left-2 -top-2 text-xs";
  //     return "left-4 top-3 text-sm";
  //   };

  const getLabelAfter = () => {
    if (required) {
      return "after:content-['*'] after:ml-0.5 after:text-red-500";
    }
    return;
  };

  return (
    <div
      className={`relative my-2 ${
        error || message ? "h-[3.75rem]" : "h-11"
      } transition-all ease-out duration-300`}
      style={{ width }}
    >
      <select
        style={{ height }}
        className={`py-3 px-4 block w-full appearance-none bg-transparent border rounded-lg cursor-pointer 
        ${getBorderColor()} focus:border-2 focus:outline-none focus:ring-0 text-sm peer ${className} `}
        onFocus={handleFocus}
        onClick={(e) => handleOnClick(e)}
        on
        {...props}
      >
        {children}
      </select>
      <label
        className={`bg-white absolute transition-all duration-200 ease-in-out pointer-events-none  left-2 -top-2 text-xs ${getLabelColor()} ${getLabelAfter()}`}
      >
        {label}
      </label>
      <p
        className={`${
          error || message ? " translate-y-0" : " -translate-y-2"
        } absolute transition duration-200 px-2 text-xs ${
          error ? "text-red-500 mt-1" : "text-green-500"
        }`}
      >
        {error || message}
      </p>
      <div className="absolute underline underline-offset-2 text-[10px] right-2 top-[12px] flex justify-center items-center pointer-events-none ">
        <box-icon
          name="down-arrow"
          type="solid"
          color="#616161"
          size="xs"
        ></box-icon>
      </div>
    </div>
  );
}
// ${
//   focus || value ? "left-2 -top-2 text-xs" : "left-4 top-3 text-sm"
// }
