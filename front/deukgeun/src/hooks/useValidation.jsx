import { useState, useRef, useEffect } from "react";

const useValidation = () => {
  const [errors, setErrors] = useState({});
  const errorsRef = useRef(errors);

  useEffect(() => {
    errorsRef.current = errors;
  }, [errors]);

  const validateUserName = (userName, tempErrors) => {
    console.log("Validating userName: ", userName); // Debugging
    if (!/^[가-힣]+$/.test(userName)) {
      tempErrors.userName = "이름은 한글로만 입력해주세요";
    }
  };

  const validateEmail = (email, tempErrors) => {
    console.log("Validating email: ", email); // Debugging
    if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "유효한 이메일 주소를 입력해주세요";
    }
  };

  const validatePassword = (password, tempErrors) => {
    console.log("Validating password: ", password); // Debugging
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
        password
      )
    ) {
      tempErrors.password =
        "비밀번호는 최소 8자, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다";
    }
  };

  const validateConfirmPassword = (password, confirmPassword, tempErrors) => {
    console.log("Validating confirmPassword: ", confirmPassword); // Debugging
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }
  };

  const validateNotEmpty = (field, value, tempErrors) => {
    console.log(`Validating ${field}: `, value); // Debugging
    if (!value) {
      tempErrors[field] = "필수 입력 항목입니다";
    }
  };

  const validateInput = (field, value, password = "") => {
    setErrors((prevErrors) => {
      const { [field]: removedError, ...restErrors } = prevErrors;
      return restErrors;
    });
    const tempErrors = {};

    if (value === "") return;
    switch (field) {
      case "userName":
        validateUserName(value, tempErrors);
        break;
      case "email":
        validateEmail(value, tempErrors);
        break;
      case "password":
        validatePassword(value, tempErrors);
        break;
      case "confirmPassword":
        console.log(password, field, value);
        validateConfirmPassword(password, value, tempErrors);

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

  const validateForm = (userData, confirmPassword) => {
    const tempErrors = {};
    validateUserName(userData.userName, tempErrors);
    validateEmail(userData.email, tempErrors);
    validatePassword(userData.password, tempErrors);
    validateConfirmPassword(userData.password, confirmPassword, tempErrors);
    Object.entries(userData).forEach(([key, value]) => {
      if (key === "address" || key === "detailAddress") return;
      validateNotEmpty(key, value, tempErrors);
    });
    validateNotEmpty("confirmPassword", confirmPassword, tempErrors);

    setErrors(tempErrors);
    console.log("유효성 검사 후 에러: ", tempErrors); // Debugging
    return Object.keys(tempErrors).length === 0;
  };

  return {
    errors,
    validateUserName,
    validateEmail,
    validatePassword,
    validateConfirmPassword,
    validateNotEmpty,
    validateInput,
    validateForm,
  };
};

export default useValidation;
