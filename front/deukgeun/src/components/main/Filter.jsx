import React from "react";
import curvedUnderline from "../../assets/curved-underline.png";
import ReactTypingEffect from "react-typing-effect";

// https://www.npmjs.com/package/react-typing-effect
const Filter = ({ label, emoji, rotated = true, className }) => {
  const interval = 9000;
  const options = {
    eraseDelay: interval - (label.length * 200 * 2 + 2000),
    typingDelay: 1000,
    speed: 200,
    eraseSpeed: 200,
  };
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative text-nowrap">
        {/* <span className="text-5xl font-normal tracking-tighter">{label}</span> */}
        <ReactTypingEffect
          text={label}
          cursorRenderer={(cursor) => <h1 className="text-5xl">{cursor}</h1>}
          displayTextRenderer={(label, i) => {
            return (
              <h1>
                {label.split("").map((char, i) => {
                  const key = `${i}`;
                  return (
                    <span
                      key={key}
                      className="text-5xl font-normal tracking-tighter"
                    >
                      {char}
                    </span>
                  );
                })}
              </h1>
            );
          }}
          speed={options.speed}
          eraseSpeed={options.eraseSpeed}
          // eraseSpeed={250}
          typingDelay={options.typingDelay}
          eraseDelay={options.eraseDelay}
        />
      </div>
      <div className={`${rotated && "rotate-12"} inline-block`}>
        <span className="text-6xl">{emoji}</span>
      </div>
    </div>
  );
};

export default Filter;
