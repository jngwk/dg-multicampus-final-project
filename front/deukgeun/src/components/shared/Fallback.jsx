import React from "react";
import Loader from "./Loader";

const Fallback = () => {
  return (
    <div className="absolute h-full w-full top-0 left-0 bg-gray-500/50 flex justify-center items-center">
      <Loader />
    </div>
  );
};

export default Fallback;
