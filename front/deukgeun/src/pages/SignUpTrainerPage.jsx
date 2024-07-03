import React, { useState } from 'react';
import { signUpTrainer } from '../api/signUpApi';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';
// import AddressModal from "../components/modals/AddressModal";
import useValidation from "../hooks/useValidation";

function SignUpTrainerPage() {
  // const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);

  const [trainerInfo, setTrainerInfo] = useState({
    userName: '',
    email: '',
    password: '',
    address: '',
    detailAddress: ''
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const { errors, resetErrors, validateForm, validateInput } = useValidation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
    validateInput(name, value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    validateInput("confirmPassword", e.target.value, trainerInfo.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm(trainerInfo, confirmPassword);
    if (!isValid) {
      console.log("Validation failed");
      return;
    }
    try {
      const response = await signUpTrainer(trainerInfo);
      console.log('Response:', response);
      alert('트레이너가 성공적으로 등록되었습니다!');
      // 선택적으로, 회원 가입 후 다른 페이지로 리디렉션할 수 있음
    } catch (error) {
      console.error('Error:', error.message);
      alert('트레이너 등록에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-start text-3xl font-extrabold text-gray-900"> 📑 트레이너 등록</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm space-y-4">
            <div className="flex flex-row items-center space-x-3">
              <label className="text-sm w-28">트레이너 이름</label>
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
              <label className="text-sm w-28">이메일</label>
              <Input
                type="text"
                width="100%"
                label="이메일"
                required={true}
                name="email"
                value={trainerInfo.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>
            <div className="flex flex-row items-center space-x-3">
              <label className="text-sm w-28">비밀번호</label>
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
              <label className="text-sm w-28">비밀번호 확인</label>
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
          <div className="mt-6 flex float-end">
            <Button
              label="트레이너 등록"
              type="submit"
              className="py-2 px-4 inline-flex justify-center items-center text-white hover:bg-bright-orange"
            />
          </div>
        </form>
      </div>
      {/* {isAddressModalVisible && (
        <AddressModal
          userData={trainerInfo}
          setUserData={setTrainerInfo}
          toggleModal={() => setIsAddressModalVisible(false)}
        />
      )} */}
    </div>
  );
}

export default SignUpTrainerPage;
