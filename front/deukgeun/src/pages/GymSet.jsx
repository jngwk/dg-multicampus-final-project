//헬스장 정보 설정 페이지 (헬스권/피티권 미구현)

import React, { useState } from "react";
import useValidation from "../hooks/useValidation";
import Input from "../components/shared/Input";
import AddressModal from "../components/modals/AddressModal";
import TextArea from "../components/shared/TextArea";
import UploadBox from "../components/set/UploadBox";

// 회원 정보
const initGymData = {
  GymName: "",
  crNumber: "",
  address: "",
  detailAddress: "",
  phonNumber: "",
  SNSLink: "",
  OperatingHours: "",
  introduce: "",
  priceImage: null,
  imgList: [],
};

const Gymset = () => {
  const [GymData, setGymData] = useState(initGymData);
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const { validateInput } = useValidation();

  const handleGymDataChange = (e) => {
    const { name, value } = e.target;
    setGymData({
      ...GymData,
      [name]: value,
    });

    validateInput(name, value);
  };
  const handlePriceImageChange = (files) => {
    const priceImage = files[0];
    setGymData({
      ...GymData,
      priceImage: priceImage,
    });
  };

  const handleImgListChange = (files) => {
    setGymData({
      ...GymData,
      imgList: files.slice(0, 12),
    });
  };


  return (
    <>
      <div className="flex flex-col space-y-6">
        <p className="font-extrabold text-2xl pb-7">헬스권 정보 설정</p>
        <div className="py-10 px-7 mx-6 rounded-lg flex flex-col space-y-4 w-[1000px] h-fit border border-peach-fuzz">
          {/* 업체명 */}
          <div className="flex flex-row space-x-44">
            <p className="mt-3 w-13">업체명</p>
            <Input
              label="업체명"
              width="320px"
              name="GymName"
              required={true}
              onChange={handleGymDataChange}
            />
          </div>
          {/* 사업자 번호 */}
          <div className="flex flex-row space-x-36">
            <p className="mt-3 w-13">사업자번호</p>
            <Input
              label="사업자번호"
              width="320px"
              name="crNumber"
              required={true}
              onChange={handleGymDataChange}
            />
          </div>
          {/* 주소 */}
          <div className="flex flex-row space-x-48">
            <p className="mt-3">주소</p>
            <div className="flex flex-col">
              <Input
                label="주소"
                width="320px"
                name="address"
                readOnly={true}
                feature="검색"
                featureOnClick={() => setIsAddressModalVisible(true)}
                featureEnableOnLoad={true}
                required={true}
                onChange={handleGymDataChange}
              />
              <Input
                label="세부주소"
                width="320px"
                name="detailAddress"
                required={true}
                onChange={handleGymDataChange}
              />
            </div>
          </div>
          {/* 전화번호 */}
          <div className="flex flex-row space-x-40">
            <p className="mt-3">전화번호</p>
            <Input
              label="센터 or 대표자 전화번호 ('-'입력) "
              width="320px"
              name="phonNumber"
              required={true}
              onChange={handleGymDataChange}
            />
          </div>
          {/* SNS링크 */}
          <div className="flex flex-row space-x-40">
            <p className="mt-3">SNS링크</p>
            <Input
              label="Instagram or Youtube 링크 입력"
              width="320px"
              name="SNSLink"
              required={true}
              onChange={handleGymDataChange}
            />
          </div>
          {/* 운영시간 */}
          <div className="flex flex-row space-x-40">
            <p className="mt-3">운영시간</p>
            <TextArea
              label="운영시간"
              width="320px"
              height="150px"
              name="OperatingHours"
              required={true}
              onChange={handleGymDataChange}
            />
          </div>
          {/* 가격표 이미지 */}
          <div className="flex flex-row space-x-40">
            <p className="mt-3 w-[73px]">가격표 이미지</p>
            <UploadBox
              name="priceImage"
              required={true}
              onChange={handlePriceImageChange}
            />
          </div>
          {/* 센터 상세 이미지 */}
          <div className="flex flex-row space-x-32">
            <p className="mt-3 pre-line w-28">센터이미지 (최대 12장)</p>
            <UploadBox
              name="imgList"
              required={true}
              onChange={handleImgListChange}
            />
          </div>
          {/* 센터 설명 */}
          <div className="flex flex-row space-x-40">
            <p className="mt-3">센터설명</p>
            <TextArea
              label="200자 이내로 입력해주세요"
              width="400px"
              height="250px"
              name="introduce"
              required={true}
              onChange={handleGymDataChange} 
            />
          </div>
        </div>
      </div>
      {isAddressModalVisible && (
        <AddressModal
          GymData={GymData}
          setGymData={setGymData}
          toggleModal={() => setIsAddressModalVisible(false)}
        />
      )}
    </>
  );
}

export default Gymset;
