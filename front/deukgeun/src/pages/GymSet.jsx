//헬스장 정보설정

import React, { useState } from "react";
import useValidation from "../hooks/useValidation";
import Input from "../components/shared/Input";
import AddressModal from "../components/modals/AddressModal";
import TextArea from "../components/shared/TextArea";
import UploadBox from "../components/set/UploadBox";
import { FaArrowRightLong, FaCircleMinus } from "react-icons/fa6";
import Button from "../components/shared/Button";
import useCustomNavigate from "../hooks/useCustomNavigate";

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
  const customNavigate = useCustomNavigate();
    
  const [GymData, setGymData] = useState(initGymData);
  const [healthProducts, setHealthProducts] = useState([]);
  const [newHealthProduct, setNewHealthProduct] = useState({ productName: "", days: "", price: "" });
  const [ptProducts, setPTProducts] = useState([]);
  const [newPTProduct, setNewPTProduct] = useState({ productName: "", ptCountTotal: "", days: "", price: "" });
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [healthErrors, setHealthErrors] = useState({});
  const [ptErrors, setPTErrors] = useState({});
  const { validateInput } = useValidation();

  const handleGymDataChange = (e) => {
    const { name, value } = e.target;
    setGymData({
      ...GymData,
      [name]: value,
    });

    validateInput(name, value);
  };

  const handleNewHealthProductChange = (e) => {
    const { name, value } = e.target;
  
    // 숫자가 아닌 경우에 대한 유효성 검사
    const newErrors = {};
    if (name === "days" && !/^\d+$/.test(value)) {
      newErrors.days = "숫자만 입력하세요.";
    }
  
    setNewHealthProduct({
      ...newHealthProduct,
      [name]: value,
    });
  
    setHealthErrors(newErrors); // 오류 상태 업데이트
  };

  const handleAddHealthProduct = () => {
    const newErrors = {};
    if (!newHealthProduct.productName) {
      newErrors.productName = "상품이름을 입력하세요.";
    }
    if (!newHealthProduct.days) {
      newErrors.days = "상품 기간을 입력하세요.";
    }
    if (!newHealthProduct.price) {
      newErrors.price = "상품 가격을 입력하세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setHealthErrors(newErrors);
      return;
    }

    setHealthProducts([...healthProducts, newHealthProduct]);
    setNewHealthProduct({ productName: "", days: "", price: "" });
    setHealthErrors({});
  };

  const handleNewPTProductChange = (e) => {
    const { name, value } = e.target;
    const newErrors = {};
    if (name === "days" && !/^\d+$/.test(value)) {
      newErrors.days = "숫자만 입력하세요.";
    } else if (name === "ptCountTotal" && !/^\d+$/.test(value)) {
        newErrors.ptCountTotal = "숫자만 입력하세요.";
    }

    setNewPTProduct({
      ...newPTProduct,
      [name]: value,
    });
    setPTErrors(newErrors); // PT 오류 상태 업데이트
  };

  const handleAddPTProduct = () => {
    const newErrors = {};
    if (!newPTProduct.productName) {
      newErrors.productName = "상품이름을 입력하세요.";
    }
    if (!newPTProduct.ptCountTotal) {
      newErrors.ptCountTotal = "PT 횟수를 입력하세요.";
    }
    if (!newPTProduct.days) {
      newErrors.days = "상품 기간을 입력하세요.";
    }
    if (!newPTProduct.price) {
      newErrors.price = "상품 가격을 입력하세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setPTErrors(newErrors);
      return;
    }
    setPTProducts([...ptProducts, newPTProduct]);
    setNewPTProduct({ productName: "", ptCountTotal: "", days: "", price: "" });
    setPTErrors({});
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

  const handleDeleteHealthProduct = (index) => {
    const updatedHealthProducts = healthProducts.filter((_, i) => i !== index);
    setHealthProducts(updatedHealthProducts);
  };

  const handleDeletePTProduct = (index) => {
    const updatedPTProducts = ptProducts.filter((_, i) => i !== index);
    setPTProducts(updatedPTProducts);
  };

  const handleTrainerRegisterClick = () => {
    customNavigate("/trainerSet");
};

  return (
    <>
      <div className="space-y-8 relative flex items-center justify-center my-10">
        <div className="flex flex-col space-y-6">
          <p className="font-extrabold text-2xl pb-4 flex flex-row items-center">
          <box-icon name='cog' size='40px' color='#9f8d8d'></box-icon>
          헬스권 정보 설정</p>
          <div className="py-10 px-7 mx-6 rounded-lg flex flex-col space-y-4 w-[1000px] h-fit border border-peach-fuzz">
            {/* 업체명 */}
            <div className="flex flex-row space-x-44">
              <p className="mt-3">업체명</p>
              <Input
                label="업체명"
                width="320px"
                name="GymName"
                value={GymData.GymName}
                required={true}
                onChange={handleGymDataChange}
              />
            </div>
            {/* 사업자 번호 */}
            <div className="flex flex-row space-x-36">
              <p className="mt-3 ">사업자번호</p>
              <Input
                label="사업자번호"
                width="320px"
                name="crNumber"
                value={GymData.crNumber}
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
                  value={GymData.address}
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
                  value={GymData.detailAddress}
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
                value={GymData.phonNumber}
                required={true}
                onChange={handleGymDataChange}
              />
            </div>
            {/* SNS링크 */}
            <div className="flex flex-row space-x-40">
              <p className="mt-3 w-16">SNS링크</p>
              <Input
                label="Instagram or Youtube 링크 입력"
                width="320px"
                name="SNSLink"
                value={GymData.SNSLink}
                required={true}
                onChange={handleGymDataChange}
              />
            </div>
            {/* 운영시간 */}
            <div className="flex flex-row space-x-40">
              <p className="mt-3 w-13">운영시간</p>
              <TextArea
                label="운영시간"
                width="320px"
                height="150px"
                name="OperatingHours"
                value={GymData.OperatingHours}
                required={true}
                onChange={handleGymDataChange}
              />
            </div>
            {/* 헬스권 */}
            <div className="flex flex-row space-x-36">
              <p className="mt-3 w-20 pre-line">헬스권 <br></br>상품 설정</p>
              <div className="flex flex-row space-x-5">
                <div className="flex flex-col justify-center items-center border border-gray-400 p-3 rounded-lg">
                  <Input
                    label="상품이름"
                    width="290px"
                    name="productName"
                    value={newHealthProduct.productName}
                    error={healthErrors.productName}
                    required={true}
                    onChange={handleNewHealthProductChange}
                  />
                  <Input
                    label="상품 기간 (ex. 2개월 -> 60)"
                    width="290px"
                    name="days"
                    value={newHealthProduct.days}
                    error={healthErrors.days}
                    required={true}
                    onChange={handleNewHealthProductChange}
                  />
                  <Input
                    label="상품 가격 (원 제외)"
                    width="290px"
                    name="price"
                    value={newHealthProduct.price}
                    error={healthErrors.price}
                    required={true}
                    onChange={handleNewHealthProductChange}
                  />
                  <Button
                    label="등록"
                    width="120px"
                    height="40px"
                    onClick={handleAddHealthProduct}
                  />
                </div>
                <div className="flex flex-col space-y-3 h-[250px] scrollbar overflow-y-auto overflow-x-hidden">
                  {healthProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex flex-row space-x-3 justify-center items-center"
                    >
                      <div className="w-[320px] h-20 border border-gray-400 p-3 rounded-lg flex justify-center items-center pre-line">
                        {product.productName} 
                        <br />
                        {product.days}일 / {product.price}원
                      </div>
                      <FaCircleMinus
                        size="24"
                        color="#9f8d8d"
                        className="cursor-pointer"
                        onClick={() => handleDeleteHealthProduct(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
             {/* PT권 */}
             <div className="flex flex-row space-x-36">
            <p className="mt-3 w-20 pre-line">PT권 <br></br>상품 설정</p>
              <div className="flex flex-row space-x-5">
                <div className="flex flex-col justify-center items-center border border-gray-400 p-3 rounded-lg">
                  <Input
                    label="상품이름"
                    width="290px"
                    name="productName"
                    value={newPTProduct.productName}
                    error={ptErrors.productName}
                    required={true}
                    onChange={handleNewPTProductChange}
                  />
                  <Input
                    label="PT 횟수 (ex. 10회 -> 10)"
                    width="290px"
                    name="ptCountTotal"
                    value={newPTProduct.ptCountTotal}
                    error={ptErrors.ptCountTotal}
                    required={true}
                    onChange={handleNewPTProductChange}
                  />
                  <Input
                    label="상품 기간 (ex. 60일 -> 60)"
                    width="290px"
                    name="days"
                    value={newPTProduct.days}
                    error={ptErrors.days}
                    required={true}
                    onChange={handleNewPTProductChange}
                  />
                  <Input
                    label="상품 가격 (원 제외)"
                    width="290px"
                    name="price"
                    value={newPTProduct.price}
                    error={ptErrors.price}
                    required={true}
                    onChange={handleNewPTProductChange}
                  />
                  <Button
                    label="등록"
                    width="120px"
                    height="40px"
                    onClick={handleAddPTProduct}
                  />
                </div>
                <div className="flex flex-col space-y-3 h-[250px] scrollbar overflow-y-auto overflow-x-hidden">
                  {ptProducts.map((product, index) => (
                    <div
                      key={index}
                      className="flex flex-row space-x-3 justify-center items-center"
                    >
                      <div className="w-[320px] h-20 border border-gray-400 p-3 rounded-lg flex justify-center items-center pre-line">
                        {product.productName}
                        <br />
                        {product.ptCountTotal}회 / {product.days}일 / {product.price}원
                      </div>
                      <FaCircleMinus
                        size="24"
                        color="#9f8d8d"
                        className="cursor-pointer"
                        onClick={() => handleDeletePTProduct(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>
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
                value={GymData.introduce}
                required={true}
                onChange={handleGymDataChange} 
              />
            </div>
          </div>
        </div>
      </div>
      <button className="pb-4 flex flex-row items-center font-semibold absolute right-44"
      onClick={handleTrainerRegisterClick}
      >
          트레이너 정보 등록 
          <FaArrowRightLong className="w-6 h-8 ml-3 animate-[propel_3s_infinite] "/>
      </button>
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
