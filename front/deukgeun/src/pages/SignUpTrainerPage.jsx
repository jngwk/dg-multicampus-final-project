import React, { useState } from 'react';
import { signUpTrainer } from '../api/signUpApi';
import Input from '../components/shared/Input';
import Button from '../components/shared/Button';

function SignUpTrainerPage() {
  const [trainerInfo, setTrainerInfo] = useState({
    userName: '',
    email: '',
    password: '',
    address: '',
    detailAddress: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
              onChange={handleChange}>
              </Input>
              
              {/* <input
                id="userName"
                name="userName"
                type="text"
                autoComplete="userName"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.userName}
                onChange={handleChange}
              /> */}
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
              onChange={handleChange}>
              </Input>
              {/* <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.email}
                onChange={handleChange}
              /> */}
            </div>
            <div className="flex flex-row items-center space-x-3">
              <label className="text-sm w-28">비밀번호</label>
              <Input
              type="text"
              width="100%"
              label="비밀번호"
              required={true}
              name="password"
              value={trainerInfo.password}
              onChange={handleChange}>
              </Input>
              {/* <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.password}
                onChange={handleChange}
              /> */}
            </div>
            <div className="flex flex-row items-center space-x-3">
              <label className="text-sm w-28">주소</label>
              <Input
              type="text"
              width="100%"
              label="주소"
              required={true}
              name="address"
              value={trainerInfo.address}
              onChange={handleChange}>
              </Input>
              {/* <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                주소
              </label>
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="address"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.address}
                onChange={handleChange}
              /> */}
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
              onChange={handleChange}>
              </Input>
              {/* <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-700">
                상세 주소
              </label>
              <input
                id="detailAddress"
                name="detailAddress"
                type="text"
                autoComplete="detailAddress"
                required
                className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={trainerInfo.detailAddress}
                onChange={handleChange}
              /> */}
            </div>
          </div>
          <div className="mt-6 flex float-end">
            <Button
            label="트레이너 등록"
            type="submit"
            className="py-2 px-4 inline-flex justify-center items-center text-white hover:bg-bright-orange"
            >
              트레이너 등록
            </Button>
            {/* <button
              type="submit"
              className="w-full bg-indigo-600 border border-transparent rounded-md py-2 px-4 inline-flex justify-center items-center text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
            >
              트레이너 등록
            </button> */}
          </div>
        </form>

      </div>
    </div>
  );
}

export default SignUpTrainerPage;
