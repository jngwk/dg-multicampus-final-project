import React, { useState, useEffect } from "react";

export default function Input({
  label,
  placeholder = "",
  type = "text",
  className,
  height = "44px",
  width = "240px",
  value = "",
  validationState = null, // 'valid', 'invalid', or null
  ...props
}) {
  const [focus, setFocus] = useState(false);

  const handleFocus = () => setFocus(true);
  const handleBlur = () => setFocus(false);

  const getBorderColor = () => {
    if (validationState === "invalid") return "border-red-500";
    if (validationState === "valid") return "border-green-400";
    return focus ? "border-peach-fuzz" : "border-gray-400";
  };

  const getLabelColor = () => {
    if (validationState === "invalid") return "text-red-500";
    if (validationState === "valid") return "text-green-400";
    return focus ? "text-peach-fuzz" : "text-gray-400";
  };

  const getLabelPosition = () => {
    if (type === "time" || type === "date" || focus || value)
      return "left-2 -top-2 text-xs";
    return "left-4 top-3 text-sm";
  };

  return (
    <div className={`relative my-2`} style={{ width }}>
      <input
        style={{ height }}
        type={type}
        height={height}
        className={`py-3 px-4 block w-full appearance-none bg-transparent border rounded-lg 
        ${getBorderColor()} focus:border-2 focus:outline-none focus:ring-0 text-sm peer ${className}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        {...props}
      />
      <label
        className={`bg-white absolute transition-all duration-200 ease-in-out pointer-events-none  ${getLabelPosition()} ${getLabelColor()} `}
      >
        {label}
      </label>
      {/* input 우측 끝에 icon 혹은 버튼 넣기 */}
    </div>
  );
}
// ${
//   focus || value ? "left-2 -top-2 text-xs" : "left-4 top-3 text-sm"
// }
