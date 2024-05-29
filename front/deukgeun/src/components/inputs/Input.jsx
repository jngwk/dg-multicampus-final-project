import React, { useState } from "react";

export default function Input({ label, type = "text", className, ...props }) {
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState("");

  const handleFocus = () => setFocus(true);
  const handleBlur = () => {
    if (value === "") {
      setFocus(false);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <div className="relative w-[240px] my-2">
      <input
        type={type}
        className={`${className} p-3 block w-full appearance-none bg-transparent border rounded-md
        ${focus ? "border-peach-fuzz" : "border-gray-300"} 
        focus:outline-none focus:ring-0 text-lg peer`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
        {...props}
      />
      <label
        className={`bg-white absolute left-2 transition-all duration-200 ease-in-out ${
          focus || value
            ? "-top-2 text-xs text-peach-fuzz"
            : "top-3 text-gray-500"
        } peer-focus:-top-2 peer-focus:text-xs peer-focus:text-peach-fuzz`}
      >
        {label}
      </label>
    </div>
  );
}
