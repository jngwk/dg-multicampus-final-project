import React from "react";

const useCustomDate = () => {
  const getTime = (timeDiff = 0) => {
    const date = new Date();
    date.setHours(date.getHours() + timeDiff);

    // 30분 간격으로 시간 설정
    const minutes = date.getMinutes();
    if (minutes === 0) {
      date.setMinutes(30);
    } else {
      date.setMinutes(minutes <= 30 ? 30 : 60);
    }

    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const computeTime = (time, timeDiff = 0) => {
    const date = new Date();
    // Parse input time
    const [hours, minutes] = time.split(":");
    date.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    // Add time diff
    date.setMinutes(date.getMinutes() + timeDiff * 60);

    // Return the new time as a string in HH:mm:ss format
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return { computeTime, getTime, getCurrentDate };
};

export default useCustomDate;
