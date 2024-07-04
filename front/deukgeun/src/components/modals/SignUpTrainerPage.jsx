import React, { useState } from "react";
import { signUpTrainer } from "../../api/signUpApi";
import Input from "../shared/Input";
import Button from "../shared/Button";
// import AddressModal from "../components/modals/AddressModal";
import useValidation from "../../hooks/useValidation";
import ModalLayout from "./ModalLayout";
import useEmailVerification from "../../hooks/useEmailVerification";
import AlertModal from "./AlertModal";

function SignUpTrainerModal({ toggleModal }) {
  // const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isAlerModalVisible, setIsAlerModalVisible] = useState(false);
  const [code, setCode] = useState();
  const [isCodeVerified, setIsCodeVerified] = useState();
  const { isCodeSent, sendCode, validateCode, initCodeStates } =
    useEmailVerification();

  const [trainerInfo, setTrainerInfo] = useState({
    userName: "",
    email: "",
    password: "",
    address: "",
    detailAddress: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const { errors, validateForm, validateInput } = useValidation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
    validateInput(name, value);

    if (name === "email" && isCodeSent) {
      initCodeStates();
      setCode();
    }
  };
  const handleCodeChange = (e) => {
    setCode(e.target.value);
    if (e.target.value == "") {
      setIsCodeVerified(null);
    } else if (code && !validateCode(e.target.value)) {
      setIsCodeVerified(false);
    } else {
      setIsCodeVerified(true);
    }
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    validateInput("confirmPassword", e.target.value, trainerInfo.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm(trainerInfo, confirmPassword, isCodeVerified);
    if (!isValid) {
      console.log("Validation failed");
      return;
    }
    try {
      const response = await signUpTrainer(trainerInfo);
      console.log("Response:", response);
      if (response.result === true) {
        setIsAlerModalVisible(true);
      }
      // 선택적으로, 회원 가입 후 다른 페이지로 리디렉션할 수 있음
    } catch (error) {
      console.error("Error:", error.message);
      alert("트레이너 등록에 실패했습니다.");
    }
  };

  return (
    <ModalLayout toggleModal={toggleModal}>
      {/* min-h-screen  */}
      <div className="flex justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl w-full space-y-8">
          <div>
            <h2 className="text-start text-3xl font-extrabold text-gray-900">
              📑 트레이너 등록
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm space-y-2">
              <div className="flex flex-row items-center">
                {/* <label className="text-sm w-28">트레이너 이름</label> */}
                <Input
                  type="text"
                  width="100%"
                  label="트레이너 이름"
                  required={true}
                  name="userName"
                  value={trainerInfo.userName}
                  onChange={handleChange}
                  error={errors.userName}
                />
              </div>
              <div className="flex flex-row items-center space-x-3">
                {/* <label className="text-sm w-28">이메일</label> */}
                <Input
                  type="text"
                  width="100%"
                  label="이메일"
                  required={true}
                  name="email"
                  value={trainerInfo.email}
                  onChange={handleChange}
                  error={errors.email}
                  feature="인증"
                  featureOnClick={() => sendCode(trainerInfo.email)}
                />
              </div>
              {isCodeSent && (
                <div className="flex flex-row items-center space-x-3">
                  <Input
                    type="text"
                    width="100%"
                    label="인증번호"
                    required={true}
                    name="code"
                    value={code}
                    onChange={handleCodeChange}
                    readOnly={isCodeVerified}
                    error={
                      isCodeVerified === false &&
                      "인증번호가 일치하지 않습니다."
                    }
                    message={
                      isCodeVerified === true && "인증이 완료 되었습니다."
                    }
                  />
                </div>
              )}
              <div className="flex flex-row items-center space-x-3">
                {/* <label className="text-sm w-28">비밀번호</label> */}
                <Input
                  type="password"
                  width="100%"
                  label="비밀번호"
                  required={true}
                  name="password"
                  value={trainerInfo.password}
                  onChange={handleChange}
                  error={errors.password}
                />
              </div>
              <div className="flex flex-row items-center space-x-3">
                {/* <label className="text-sm w-28">비밀번호 확인</label> */}
                <Input
                  type="password"
                  width="100%"
                  label="비밀번호 확인"
                  required={true}
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  error={errors.confirmPassword}
                />
              </div>
              {/* <div className="flex flex-row items-center space-x-3">
              <label className="text-sm w-28">주소</label>
              <Input
                type="text"
                width="100%"
                label="주소"
                required={true}
                name="address"
                value={trainerInfo.address}
                onChange={handleChange}
                readOnly={true}
                error={errors.address}
                feature="검색"
                featureOnClick={() => setIsAddressModalVisible(true)}
                featureEnableOnLoad={true}

              />
            </div>
            <div className="flex flex-row items-center space-x-3">
              <label className="text-sm w-28">상세 주소</label>
              <Input
                type="text"
                width="100%"
                label="상세 주소"
                required={true}
                name="detailAddress"
                value={trainerInfo.detailAddress}
                onChange={handleChange}
                error={errors.detailAddress}
              />
            </div> */}
            </div>
            <div className="flex float-end">
              <Button
                label="트레이너 등록"
                type="submit"
                className="py-2 px-4 inline-flex justify-center items-center text-white hover:bg-bright-orange"
              />
            </div>
          </form>
        </div>
        {isAlerModalVisible && (
          <AlertModal
            headerEmoji={"✔️"}
            line1={"트레이너 등록이 완료 됐습니다!"}
            button1={{ label: "확인", onClick: toggleModal }}
          />
        )}
        {/* {isAddressModalVisible && (
          <AddressModal
            userData={trainerInfo}
            setUserData={setTrainerInfo}
            toggleModal={() => setIsAddressModalVisible(false)}
          />
        )} */}
      </div>
    </ModalLayout>
  );
}

export default SignUpTrainerModal;
