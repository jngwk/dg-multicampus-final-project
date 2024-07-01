import React from "react";

const useMasking = () => {
  function maskEmail(email) {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 2) {
      return `${localPart}@${domain}`;
    }
    const maskedLocalPart = localPart.slice(0, 2) + "*".repeat(3);
    return `${maskedLocalPart}@${domain}`;
  }
  return maskEmail;
};

export default useMasking;
