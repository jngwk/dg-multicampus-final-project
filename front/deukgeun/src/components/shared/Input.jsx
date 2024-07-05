import React, { useState } from "react";

export default function Input({
  label, // 이름
  type = "text", // 타입
  className, // input element 추가 스타일
  height = "44px", // 높이
  width = "240px", // 너비
  value = "", // 값
  step, // type=time에만 해당 (증가/감소치)
  required = false, // required
  error = "", // 에러 메세지 (빨간색으로 하단에 표시)
  message = "", // 메세지 (초록색으로 하단에 표시)
  feature = "", // input 우측에 표시되는 버튼 이름
  featureOnClick, // 버튼 onClick 함수
  featureEnableOnLoad = false, // 유효성 검사 없이 버튼 눌러도 되는지
  placeholder = "",
  onChange,
  ...props
}) {
  const [focus, setFocus] = useState(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

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

  const getLabelPosition = () => {
    if (type === "time" || type === "date" || focus || value)
      return "left-2 -top-2 text-xs";
    return "left-4 top-3 text-sm";
  };

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
      <input
        style={{ height }}
        type={type}
        className={`py-3 px-4 block w-full appearance-none bg-white border rounded-lg
        ${getBorderColor()} focus:border-2 focus:outline-none focus:ring-0 text-sm peer ${className} `}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        step={step}
        placeholder={placeholder}
        onChange={onChange}
        {...props}
      />
      <label
        className={`bg-white absolute transition-all duration-200 ease-in-out pointer-events-none  ${getLabelPosition()} ${getLabelColor()} ${getLabelAfter()}`}
      >
        {label}
      </label>
      <p
        className={`mb-2  ${
          error || message ? " translate-y-0" : " -translate-y-2"
        } absolute transition duration-200 px-2 text-xs ${
          error ? "text-red-500 mt-1" : "text-green-500"
        }`}
      >
        {error || message}
      </p>
      {feature && (
        <span
          className={`absolute underline underline-offset-2 text-[10px] right-2 top-[14px] text-gray-500 ${
            featureEnableOnLoad
              ? "cursor-pointer hover:text-peach-fuzz"
              : !error &&
                !message &&
                value &&
                "cursor-pointer hover:text-peach-fuzz"
          }`}
          onClick={featureOnClick}
        >
          {feature}
        </span>
      )}
    </div>
  );
}
// ${
//   focus || value ? "left-2 -top-2 text-xs" : "left-4 top-3 text-sm"
// }
