import { useState } from "react";

const useValidation = (initialValue, validate) => {
  const [value, setValue] = useState(initialValue);
  const [validationState, setValidationState] = useState(null); // 'valid', 'invalid', or null

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setValidationState(validate(newValue) ? "valid" : "invalid");
  };

  return {
    value,
    validationState,
    handleChange,
  };
};

export default useValidation;

// 유효성 검사를 받아서 사용하기 (아래 코드들을 회원가입에 추가)
/*
const validateEmail = (value) => {
    // 유효성 검사
    const isValid = /^\S+@\S+\.\S+$/.test(value);
    setEmailValidationState(isValid ? "valid" : "invalid");
  };

  const validatePassword = (value) => {
    // 유효성 검사
    const isValid = value.length >= 6;
    setPasswordValidationState(isValid ? "valid" : "invalid");
  };


*/
