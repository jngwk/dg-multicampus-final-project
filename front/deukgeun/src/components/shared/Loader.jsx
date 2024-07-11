import React from "react";
import SyncLoader from "react-spinners/SyncLoader";

const Loader = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <SyncLoader color="#ffbe98" />
    </div>
  );
};

export default Loader;
