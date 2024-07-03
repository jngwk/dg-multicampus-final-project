import React, { useState } from "react";
import { checkDuplicateEmail, sendVerificationEmail } from "../api/signUpApi";

const useEmailVerification = () => {
  const [sentCode, setSentCode] = useState();
  const [isCodeSent, setIsCodeSent] = useState(false);
  // const [emailExists, setEmailExists] = useState(false);

  const checkEmailExists = async (email) => {
    try {
      const res = await checkDuplicateEmail(email);
      console.log("email 확인", res);
      return res;
    } catch (error) {
      console.log("error checking duplicate email", error);
    }
  };

  const generateVerificationCode = () => {
    const generatedCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    return generatedCode;
  };

  const sendCode = async (email) => {
    try {
      const verifCode = generateVerificationCode();
      setSentCode(verifCode);
      const data = sendVerificationEmail(email, verifCode);
      console.log(data);
      setIsCodeSent(true);
      return data;
    } catch (error) {
      console.error("error sending verification code in password modal", error);
    }
  };

  const validateCode = (code) => {
    if (code && code?.trim() === sentCode) {
      return true;
    } else {
      return false;
    }
  };

  const initCodeStates = () => {
    setSentCode();
    setIsCodeSent(false);
  };

  return {
    isCodeSent,
    checkEmailExists,
    sendCode,
    validateCode,
    initCodeStates,
  };
};

export default useEmailVerification;
