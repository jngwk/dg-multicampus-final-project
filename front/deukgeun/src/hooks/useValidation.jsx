import { useState, useRef, useEffect } from "react";
import {
  checkDuplicateEmail,
  checkDuplicateCRNumber,
  checkCrNumber,
} from "../api/signUpApi";

const useValidation = () => {
  const [errors, setErrors] = useState({});
  const errorsRef = useRef(errors);

  useEffect(() => {
    errorsRef.current = errors;
  }, [errors]);

  const validateUserName = (userName, tempErrors) => {
    // console.log("Validating userName: ", userName); // Debugging
    // if (!/^[가-힣]+$/.test(userName)) {
    //   tempErrors.userName = "이름은 한글로만 입력해주세요";
    // }
    return tempErrors.userName !== "";
  };

  const validateEmail = async (email, tempErrors) => {
    // console.log("Validating email: ", email); // Debugging
    if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "유효한 이메일 주소를 입력해주세요";
    } else {
      try {
        const isDuplicate = await checkDuplicateEmail(email);
        console.log("is duplicate", isDuplicate);
        if (!isDuplicate) return;
        tempErrors.email = "이미 가입된 이메일입니다";
      } catch (error) {
        console.error(error);
      }
    }
    // console.log(tempErrors.email);
    return tempErrors.email !== "";
  };
  // const validateEmailVerification = (verified, tempErrors) => {
  //   !verified && (tempErrors.email = "이메일 인증이 되지 않았습니다.");
  // };

  const validatePassword = (password, tempErrors) => {
    // console.log("Validating password: ", password); // Debugging
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(
        password
      )
    ) {
      tempErrors.password =
        "최소 8자, 영문 대소문자, 숫자, 특수문자를 포함해야 합니다";
    }
    return tempErrors.password !== "";
  };

  const validateConfirmPassword = (password, confirmPassword, tempErrors) => {
    // console.log("Validating confirmPassword: ", confirmPassword); // Debugging
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다";
    }
    return tempErrors.confirmPassword !== "";
  };

  const validateCRNumber = async (crNumber, tempErrors) => {
    try {
      const isDuplicate = await checkDuplicateCRNumber(crNumber);
      if (isDuplicate) {
        tempErrors.crNumber = "이미 가입된 번호입니다";
      }
    } catch (error) {
      console.error(error);
    }
  };

  const validateNotEmpty = (field, value, tempErrors) => {
    // console.log(`Validating ${field}: `, value); // Debugging
    if (!value) {
      tempErrors[field] = "필수 입력 항목입니다";
    }
    return tempErrors[field] !== "";
  };

  const validateInput = async (
    field,
    value,
    password = "",
    verified = true
  ) => {
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
        await validateEmail(value, tempErrors);
        !verified && (tempErrors.email = "이메일 인증이 완료되지 않았습니다.");
        break;
      case "password":
        validatePassword(value, tempErrors);
        break;
      case "confirmPassword":
        validateConfirmPassword(password, value, tempErrors);
        break;
      // case "crNumber":
      //   await validateCRNumber(value, tempErrors);
      default:
        validateNotEmpty(field, value, tempErrors);
        break;
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...tempErrors,
    }));
  };

  const validateForm = (userData, confirmPassword, verified = true) => {
    const tempErrors = {};
    validateUserName(userData.userName, tempErrors);
    validateEmail(userData.email, tempErrors);
    !verified && (tempErrors.email = "이메일 인증이 완료되지 않았습니다.");
    validatePassword(userData.password, tempErrors);
    validateConfirmPassword(userData.password, confirmPassword, tempErrors);
    // if (userData.crNumebr) validateCRNumber(userData.crNumebr);
    Object.entries(userData).forEach(([key, value]) => {
      if (key === "address" || key === "detailAddress") return;
      validateNotEmpty(key, value, tempErrors);
    });
    validateNotEmpty("confirmPassword", confirmPassword, tempErrors);
    setErrors(tempErrors);
    // console.log("유효성 검사 후 에러: ", tempErrors); // Debugging
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

export default useValidation;
