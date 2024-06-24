import React from "react";
import curvedUnderline from "../../assets/curved-underline.png";
import ReactTypingEffect from "react-typing-effect";

const Filter = ({ label, emoji, underlineWidth }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
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
          eraseSpeed={250}
        />
        {/* <div style={{ width: underlineWidth }} className="absolute right-0">
          <img src={curvedUnderline} alt="underline" />
        </div> */}
      </div>
      <div className="rotate-12 inline-block">
        <span className="text-6xl">{emoji}</span>
      </div>
    </div>
  );
};

export default Filter;
