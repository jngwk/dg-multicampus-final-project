import React from "react";
import { SyncLoader } from "react-spinners";

const Fallback = () => {
  return (
    <div className="absolute h-full w-full top-0 left-0 bg-white flex flex-col gap-8 justify-center items-center">
      <SyncLoader color="#ffbe98" margin={15} size={40} />
      <span className="text-3xl translate-x-3 font-extrabold text-grayish-red animate-fadeInOut">
        Loading...
      </span>
    </div>
  );
};

export default Fallback;
