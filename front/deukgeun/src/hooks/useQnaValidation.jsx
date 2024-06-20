import { useState, useRef, useEffect } from "react";

const useQnaValidation = () => {
  const [errors, setErrors] = useState({});
  const errorsRef = useRef(errors);

  useEffect(() => {
    errorsRef.current = errors;
  }, [errors]);

  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  const validateUserName = (userName, tempErrors) => {
    if (!/^[가-힣]+$/.test(userName)) {
      tempErrors.userName = "이름은 한글로만 입력해주세요";
    }
  };

  const validateEmail = (email, tempErrors) => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "유효한 이메일 주소를 입력해주세요";
    }
  };

  const validateNotEmpty = (field, value, tempErrors) => {
    if (!value) {
      tempErrors[field] = "필수 입력 항목입니다";
    }
  };

  const validateInput = (field, value) => {
    setErrors((prevErrors) => {
      const { [field]: removedError, ...restErrors } = prevErrors;
      return restErrors;
    });
    const tempErrors = {};

    if (value === "") return;

    if (isLoggedIn && (field === "userName" || field === "email")) return;

    switch (field) {
      case "userName":
        validateUserName(value, tempErrors);
        break;
      case "email":
        validateEmail(value, tempErrors);
        break;
      default:
        validateNotEmpty(field, value, tempErrors);
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...tempErrors,
    }));
  };

  const validateForm = (userData) => {
    const tempErrors = {};

    if (!isLoggedIn) {
      validateUserName(userData.userName, tempErrors);
      validateEmail(userData.email, tempErrors);
    }

    Object.entries(userData).forEach(([key, value]) => {
      if (!(isLoggedIn && (key === "userName" || key === "email"))) {
        validateNotEmpty(key, value, tempErrors);
      }
    });

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const resetErrors = () => {
    setErrors({});
  };

  return {
    errors,
    setErrors,
    resetErrors,
    validateNotEmpty,
    validateInput,
    validateForm,
  };
};

export default useQnaValidation;
