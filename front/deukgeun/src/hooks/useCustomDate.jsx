import React from "react";

const useCustomDate = () => {
  const getTime = (timeDiff = 0) => {
    const date = new Date();
    date.setHours(date.getHours() + timeDiff);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };
  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  return { getTime, getCurrentDate };
};

export default useCustomDate;
