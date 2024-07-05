import React, { useEffect, useState } from "react";
import useValidation from "../hooks/useValidation";
import Input from "../components/shared/Input";
import AddressModal from "../components/modals/AddressModal";
import TextArea from "../components/shared/TextArea";
import UploadBox from "../components/set/UploadBox";
import { FaArrowRightLong, FaCircleMinus } from "react-icons/fa6";
import Button from "../components/shared/Button";
import useCustomNavigate from "../hooks/useCustomNavigate";
import { insertImage, deleteImage, GymInfo, updateGym } from "../api/gymApi";
import { useParams } from "react-router-dom";
import Select from "../components/shared/Select";
import { deleteProduct } from '../api/gymApi';

// 회원 정보
const initGymData = {
  gymId: "",
  userName: "",
  crNumber: "",
  address: "",
  detailAddress: "",
  phoneNumber: "",
  SNSLink: "",
  operatingHours: "",
  introduce: "",
  priceImage: null,
  imgList: [],
  healthProducts: [],
  ptPrdoucts: [],
};

const Gymset = () => {
  const customNavigate = useCustomNavigate();

  const { gymId } = useParams();
  const [GymData, setGymData] = useState(initGymData);
  const [newHealthProducts, setNewHealthProducts] = useState([]);
  const [newPTProducts, setNewPTProducts] = useState([]);
  const [healthProducts, setHealthProducts] = useState([]);
  const [newHealthProduct, setNewHealthProduct] = useState({ productName: "", days: "", price: "" });
  const [ptProducts, setPTProducts] = useState([]);
  const [newPTProduct, setNewPTProduct] = useState({ productName: "", ptCountTotal: "", days: "", price: "" });
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [healthErrors, setHealthErrors] = useState({});
  const [ptErrors, setPTErrors] = useState({});
  const { validateInput } = useValidation();
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (gymId) {
      fetchGymData(gymId);
    }
  }, [gymId]);

  const fetchGymData = async (gymId) => {
    try {
      const response = await GymInfo(gymId);
      const gymData = await GymInfo(gymId);
      console.log("Fetched gym data:", gymData);
      const productData = response.data||response;
      const healthProducts = (response.productList || []).filter(product => product.ptCountTotal === null);
      const ptProducts = (gymData.productList || []).filter(product => product.ptCountTotal !== null);
      setGymData({
        ...gymData,
        imgList: gymData.uploadFileName || [], // Ensure imgList is an array
      });
      setHealthProducts(healthProducts || []);
      setPTProducts(ptProducts || []);
    } catch (error) {
      console.error("Error fetching gym data:", error);
    }
  };
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
  
    const newErrors = {};
    if (name === "days" && !/^\d+$/.test(value)) {
      newErrors.days = "숫자만 입력하세요.";
    }
  
    const updatedHealthProduct = {
      ...newHealthProduct,
      [name]: value,
    };
  
    // Automatically set the product name based on days
    if (updatedHealthProduct.days) {
      updatedHealthProduct.productName = `헬스 ${updatedHealthProduct.days}일권`;
    }
  
    setNewHealthProduct(updatedHealthProduct);
    setHealthErrors(newErrors);
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

    const newProduct = { ...newHealthProduct, status: true, isNew: true };

    setHealthProducts([...healthProducts, newProduct]);
    setNewHealthProducts([...newHealthProducts, newProduct]);
    setNewHealthProduct({ productName: "", days: "", price: "" });
    setHealthErrors({});
  };

  const handleNewPTProductChange = (e) => {
  const { name, value } = e.target;

  const newErrors = {};
 if (name === "ptCountTotal" && !/^\d+$/.test(value)) {
    newErrors.ptCountTotal = "숫자만 입력하세요.";
  }

  const updatedPTProduct = {
    ...newPTProduct,
    [name]: value,
  };

  // Dynamic product name generation for PT products
  if (updatedPTProduct.ptCountTotal) {
    updatedPTProduct.productName = `PT ${updatedPTProduct.ptCountTotal}회권`;
  }

  setNewPTProduct(updatedPTProduct);
  setPTErrors(newErrors);
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

    const newProduct = { ...newPTProduct, status: true, isNew: true };
    setPTProducts([...ptProducts, newProduct]);
    setNewPTProducts([...newPTProducts, newProduct]);
    setNewPTProduct({ productName: "", ptCountTotal: "", days: "", price: "" });
    setPTErrors({});
  };

  const handlePriceImageChange = (files) => {
    const priceImage = files[0];
    console.log("Price image selected:", priceImage);
    setGymData({
      ...GymData,
      priceImage: priceImage,
    });
  };

  const handleImgListChange = (files) => {
    const fileArray = Array.from(files);
    console.log("Selected files:", fileArray);
    setImages(fileArray.slice(0, 12));
    // setGymData({
    //   ...GymData,
    //   imgList: fileArray.slice(0, 12),
    // });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const gymData = {
        gymId: GymData.gymId,
        userName: GymData.userName,
        crNumber: GymData.crNumber,
        address: GymData.address,
        detailAddress: GymData.detailAddress,
        phoneNumber: GymData.phoneNumber,
        SNSLink: GymData.SNSLink,
        operatingHours: GymData.operatingHours,
        introduce: GymData.introduce,
        productList: [
          ...newHealthProducts.map(product => ({
            ...product,
            productType: "HEALTH"
          })),
          ...newPTProducts.map(product => ({
            ...product,
            productType: "PT"
          }))
        ]
      };
      console.log("gymData: ", gymData);
      const gymId = gymData.gymId;
      const gymRes = await updateGym(gymId, gymData);
      console.log("gymRes", gymRes);
      if (gymRes.RESULT === "SUCCESS") {
        setNewHealthProducts([]);
        setNewPTProducts([]);

        if (images.length > 0) {
          const formData = new FormData();
          images.forEach((image, index) => {
            formData.append("files", image); // Use 'files' as the key
          });
          const insertImageResponse = await insertImage(gymId, formData);
          console.log("insertImageResponse:", insertImageResponse);
        } else {
          // 이미지가 선택되지 않은 경우에 대한 처리
          console.log("No images selected for upload.");
        }
      } else {
        // Gym 정보 업데이트 실패 시 처리
        console.error("Failed to update gym:", gymRes);
        alert("Gym 정보 업데이트에 실패했습니다.");
      }
    } catch (error) {
      console.error("Failed to add gym", error);
      alert("Gym 정보 업데이트에 실패했습니다.");
    }
  };

  const handleDeleteImage = async (image) => {
    try {
      const response = await deleteImage(image);

      if (response.RESULT === "SUCCESS") {
        console.log("Image deleted successfully:", image);
        setGymData({
          ...GymData,
          imgList: GymData.imgList.filter((img) => img !== image),
        });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };
  const handleDeleteHealthProduct = async (index) => {
    const productToDelete = healthProducts[index];
    if (productToDelete.productId) {
      try {
        const result = await deleteProduct(productToDelete.productId);
        if (result.RESULT === "SUCCESS") {
          console.log("Health product deleted successfully");
          const updatedHealthProducts = healthProducts.filter((_, i) => i !== index);
          setHealthProducts(updatedHealthProducts);
        } else {
          console.error("Failed to delete health product");
        }
      } catch (error) {
        console.error("Error deleting health product:", error);
      }
    } else {
      // 새로 추가된 상품이라면 그냥 state에서 제거
      const updatedHealthProducts = healthProducts.filter((_, i) => i !== index);
      setHealthProducts(updatedHealthProducts);
    }
  };

  const handleDeletePTProduct = async (index) => {
    const productToDelete = ptProducts[index];
    if (productToDelete.productId) {
      try {
        const result = await deleteProduct(productToDelete.productId);
        if (result.RESULT === "SUCCESS") {
          console.log("PT product deleted successfully");
          const updatedPTProducts = ptProducts.filter((_, i) => i !== index);
          setPTProducts(updatedPTProducts);
        } else {
          console.error("Failed to delete PT product");
        }
      } catch (error) {
        console.error("Error deleting PT product:", error);
      }
    } else {
      // 새로 추가된 상품이라면 그냥 state에서 제거
      const updatedPTProducts = ptProducts.filter((_, i) => i !== index);
      setPTProducts(updatedPTProducts);
    }
  };

  const handleTrainerRegisterClick = () => {
    customNavigate("/trainerSet");
  };

  return (
    <>
      <div className="space-y-8 relative flex items-center justify-center my-10">
        <div className="flex flex-col space-y-6">
          <p className="font-extrabold text-2xl pb-4 flex flex-row items-center space-x-2">
            <box-icon name="cog" size="40px" color="#9f8d8d"></box-icon>
           <p> 헬스장 상세 정보 </p>
          </p>
          <div className="py-10 px-7 mx-6 rounded-lg flex flex-col space-y-4 w-[1000px] h-fit border-y-8 border-dotted border-peach-fuzz border-opacity-50">
            {/* 업체명 */}
            <div className="flex flex-row space-x-44">
              <p className="mt-3">업체명</p>
              <Input
                label="업체명"
                width="320px"
                name="userName"
                value={GymData.userName}
                readOnly={true}
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
                readOnly={true}
                // required={true}
                // onChange={handleGymDataChange}
              />
            </div>
            {/* 주소*/}
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
                  // required={true}
                  onChange={handleGymDataChange}
                  // readOnly={true}
                />
              </div>
            </div>
            {/* 전화번호 */}
            <div className="flex flex-row space-x-40">
              <p className="mt-3">전화번호</p>
              <Input
                label="센터 or 대표자 전화번호 ('-'입력) "
                width="320px"
                name="phoneNumber"
                value={GymData.phoneNumber}
                required={true}
                onChange={handleGymDataChange}
              />
            </div>
            {/* SNS링크 */}
            {/* <div className="flex flex-row space-x-40">
              <p className="mt-3 w-16">SNS링크</p>
              <Input
                label="Instagram or Youtube 링크 입력"
                width="320px"
                name="SNSLink"
                value={GymData.SNSLink}
                required={true}
                onChange={handleGymDataChange}
              />
            </div> */}
            {/* 운영시간 */}
            <div className="flex flex-row space-x-40">
              <p className="mt-3 w-13">운영시간</p>
              <TextArea
                label="운영시간"
                width="320px"
                height="150px"
                name="operatingHours"
                className={`whitespace-pre`}
                value={GymData.operatingHours}
                required={true}
                onChange={handleGymDataChange}
              />
            </div>
            {/* 헬스권*/}
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
                   <Select
                    label="상품 기간"
                    name="days"
                    width="290px"
                    value={newHealthProduct.days}
                    error={healthErrors.days}
                    required={true}
                    onChange={handleNewHealthProductChange}
                    className="flex flex-col justify-center items-center border border-gray-400 p-3 rounded-lg"
                  >
                      <option value="">선택해주세요.</option>
                      {[ 30, 90, 180, 200, 365].map(count => (
                          <option key={count} value={count}>{count}일</option>
                       ))}
                  </Select>
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
                {healthProducts.filter(product => product.status !== false).map((product, index) => (
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
            {/* PT권*/}
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
                  <Select
                    label="PT횟수"
                    name="ptCountTotal"
                    width="290px"
                    value={newPTProduct.ptCountTotal}
                    error={ptErrors.ptCountTotal}
                    required={true}
                    onChange={handleNewPTProductChange}
                    className="flex flex-col justify-center items-center border border-gray-400 p-3 rounded-lg"
                  >
                    <option value="">선택해주세요.</option>
                      {[10, 20, 30, 40, 50, 60].map(count => (
                          <option key={count} value={count}>{count}회</option>
                       ))}
                  </Select>
                  <Select
                    label="상품 기간"
                    name="days"
                    width="290px"
                    value={newPTProduct.days}
                    error={ptErrors.days}
                    required={true}
                    onChange={handleNewPTProductChange}
                    className="flex flex-col justify-center items-center border border-gray-400 p-3 rounded-lg"
                  >
                    <option value="">선택해주세요.</option>
                      {[ 30, 90, 180, 200, 365].map(count => (
                          <option key={count} value={count}>{count}일</option>
                       ))}
                  </Select>
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
                {ptProducts.filter(product => product.status !== false).map((product, index) => (
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
            </div> *
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
              <div className="flex flex-wrap space-x-4 mt-4">
    {GymData.imgList && GymData.imgList.map((img, index) => (
        <div key={index} className="relative">
            <img
                src={`/images/${img}`}
                alt={`Gym image ${index}`}
                className="w-24 h-24 object-cover rounded-lg border"
            />
            <FaCircleMinus
                size="20"
                color="red"
                className="absolute top-0 right-0 cursor-pointer"
                onClick={() => handleDeleteImage(img)}
            />
        </div>
    ))}
</div>
            </div>
            {/* 센터 설명 */}
            <div className="flex flex-row space-x-40">
              <p className="mt-3">센터설명</p>
              <TextArea
                label="200자 이내로 입력해주세요"
                width="400px"
                height="250px"
                name="introduce"
                className={`whitespace-pre-line`}
                value={GymData.introduce}
                required={true}
                onChange={handleGymDataChange}
              />
            </div>
            {/* Submit Button */}
            <div className="flex justify-center mt-8">
              <button
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
                onClick={handleSubmit}
              >
                정보 수정
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <button
        className="pb-4 flex flex-row items-center font-semibold absolute right-44"
        onClick={handleTrainerRegisterClick}
      >
        트레이너 정보 등록
        <FaArrowRightLong className="w-6 h-8 ml-3 animate-[propel_3s_infinite] " />
      </button> */}
      {isAddressModalVisible && (
        <AddressModal
          GymData={GymData}
          setGymData={setGymData}
          toggleModal={() => setIsAddressModalVisible(false)}
        />
      )}
    </>
  );
};

export default Gymset;
