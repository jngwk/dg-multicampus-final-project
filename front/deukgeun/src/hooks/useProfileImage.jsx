import React, { useState } from "react";
import { getImage, getImageById } from "../api/userInfoApi";

const useProfileImage = () => {
  const [userImage, setUserImage] = useState(null);
  const fetchUserImage = async (id) => {
    try {
      let imageData = "";
      if (id) {
        console.log("@@@@@ getImageById");
        imageData = await getImageById(id);
      } else {
        console.log("@@@@@ getImage");
        imageData = await getImage();
      }
      if (imageData) {
        setUserImage(`/images/${imageData.userImage}`);
      }
    } catch (error) {
      console.error("Error fetching user image:", error);
    }
  };
  return { userImage, fetchUserImage };
};

export default useProfileImage;
