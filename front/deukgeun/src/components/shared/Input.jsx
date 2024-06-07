import React, { useState, useEffect } from "react";

export default function Input({
  label,
  placeholder = "",
  type = "text",
  className,
  height = "44px",
  width = "240px",
  value = "",
  step,
  required = false,
  error = "",
  message = "",
  validationState = null, // 'valid', 'invalid', or null
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
    <div className={`relative my-2 `} style={{ width }}>
      <input
        style={{ height, width }}
        type={type}
        className={` py-3 px-4 block w-full appearance-none bg-transparent border rounded-lg
        ${getBorderColor()} focus:border-2 focus:outline-none focus:ring-0 text-sm peer ${className} `}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        step={step}
        {...props}
      />
      <label
        className={`bg-white absolute transition-all duration-200 ease-in-out pointer-events-none  ${getLabelPosition()} ${getLabelColor()} ${getLabelAfter()}`}
      >
        {label}
      </label>
      {error && <p className="px-2 text-xs text-red-500 mt-1">{error}</p>}
      {message && <p className="px-2 text-xs text-green-500 mt-1">{message}</p>}
      {/* input 우측 끝에 icon 혹은 버튼 넣기 */}
    </div>
  );
}
// ${
//   focus || value ? "left-2 -top-2 text-xs" : "left-4 top-3 text-sm"
// }
