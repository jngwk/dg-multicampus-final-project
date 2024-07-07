import React, { useState, useEffect } from "react";
import Input from "../components/shared/Input";
import AddressModal from "../components/modals/AddressModal";
import useValidation from "../hooks/useValidation";
import CustomDatePicker from "../components/shared/DatePicker";
import formatDate from "../components/shared/FormatDate";

import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaAngleDoubleRight } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { GiArchiveRegister } from "react-icons/gi";


import bgimg from "../assets/reg.png";
import TextArea from "../components/shared/TextArea";
import { useAuth } from "../context/AuthContext";
import { registerMembership } from "../api/membershipApi";
import AlertModal from "../components/modals/AlertModal";
import { updateUserInfo } from "../api/userInfoApi";
import { useLocation } from "react-router-dom";
import useCustomNavigate from "../hooks/useCustomNavigate";
import Button from "../components/shared/Button";
import useIamport from "../hooks/useIamport";

const MemberRegister = () => {
  const location = useLocation();
  const [gym, setGym] = useState(location.state ? location.state.gym : "");
  const [genderFocus, setGenderFocus] = useState(false);
  const [ageFocus, setAgeFocus] = useState(false);
  const [userMemberReasonFocus, setMemberReasonFocus] = useState(false);
  const [userWorkoutDurationFocus, setWorkoutDurationFocus] = useState(false);

  const handleGenderFocus = () => setGenderFocus(true);
  const handleGenderBlur = () => setGenderFocus(false);
  const handleAgeFocus = () => setAgeFocus(true);
  const handleAgeBlur = () => setAgeFocus(false);
  const handleMemberReasonFocus = () => setMemberReasonFocus(true);
  const handleMemberReasonBlur = () => setMemberReasonFocus(false);
  const handleWorkoutDurationFocus = () => setWorkoutDurationFocus(true);
  const handleWorkoutDurationBlur = () => setWorkoutDurationFocus(false);

  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasNoProduct, setHasNoProduct] = useState(false);
  const [selectedProductName, setSelectedProductName] = useState(
    gym.productList && gym.productList.length > 0
      ? location.state?.product
        ? location.state.product.productName
        : gym.productList[0].productName
      : ""
  ); //선택상품
  const [selectedProductPrice, setSelectedProductPrice] = useState(
    gym.productList && gym.productList.length > 0
      ? location.state?.product
        ? location.state.product.price
        : gym.productList[0].price
      : 0
  );
  const { validateInput } = useValidation();

  const { userData, setUserData } = useAuth();
  const [userGender, setUserGender] = useState("남자"); //성별
  const [userAge, setUserAge] = useState(20); //나이
  const [regDate, setRegDate] = useState(new Date()); //시작일
  const [expDate, setExpDate] = useState(new Date()); //만료일
  const [userMemberReason, setUserMemberReason] = useState("PT");
  const [userWorkoutDuration, setUserWorkoutDuration] = useState(1);
  const [productId, setProductId] = useState(
    gym.productList && gym.productList.length > 0
      ? location.state?.product
        ? location.state.product.productId
        : gym.productList[0].productId
      : ""
  );
  const customNavigate = useCustomNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [impUid, setImpUid] = useState(""); // 여기에 imp_uid를 저장합니다.
  const [merchantUid, setMerchantUid] = useState("");
  const { requestPayment, verifyPayment, loading, error } = useIamport();

  const { fetchUserData } = useAuth();

  // useEffect(() => {
  //   if (!gym.productList || gym.productList.length === 0) {
  //     setHasNoProduct(true);
  //   } else {
  //     filterProducts();
  //   }
  // }, []);

  const filterProducts = () => {
    const filteredProductList =
      gym.productList?.filter((product) => product.ptCountTotal === 0) || [];
    const updatedGym = { ...gym, productList: filteredProductList };
    setGym(updatedGym);
    if (filteredProductList.length > 0) {
      setSelectedProductName(filteredProductList[0].productName);
      setSelectedProductPrice(filteredProductList[0].price);
      setProductId(filteredProductList[0].productId);
    }
  };

  const handleUserDataChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
    validateInput(name, value);
  };

  const handleChangeGender = (event) => {
    setUserGender(event.target.value);
  };

  const handleChangeAge = (event) => {
    setUserAge(event.target.value);
  };

  const handleChangeMemberReason = (event) => {
    setUserMemberReason(event.target.value);
  };

  const handleChangeWorkoutDuration = (event) => {
    setUserWorkoutDuration(event.target.value);
  };

  const ageOptions = [];
  for (let age = 14; age <= 90; age++) {
    ageOptions.push(
      <option key={age} value={age}>
        {age}
      </option>
    );
  }

  const WorkoutDurationOptions = [];
  for (let WorkoutDuration = 1; WorkoutDuration <= 20; WorkoutDuration++) {
    WorkoutDurationOptions.push(
      <option key={WorkoutDuration} value={WorkoutDuration}>
        {WorkoutDuration}년
      </option>
    );
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const onClickPeriod = (e) => {
    const { value } = e.target;
    const selectedProduct = gym.productList.find(
      (product) => product.productName === value
    );
    setSelectedProductName(value);
    setSelectedProductPrice(selectedProduct.price);
    setProductId(selectedProduct.productId);
    setDateRange(selectedProduct);
    toggleDropdown();
  };

  const setDateRange = (product) => {
    const today = new Date();
    let endDate = new Date(regDate);
    endDate.setDate(endDate.getDate() + product.days);
    setExpDate(endDate);
  };

  useEffect(() => {
    if (gym.productList && gym.productList.length > 0) {
      const initialProduct = gym.productList.find(
        (product) => product.productName === selectedProductName
      );
      setDateRange(initialProduct);
    }
  }, [regDate, selectedProductName, gym.productList]);

  const handleRegDateChange = (date) => {
    const today = new Date();
    if (date < today) {
      alert("시작일은 오늘보다 이전일 수 없습니다.");
      return;
    } else {
      setRegDate(date);
      const selectedProduct = gym.productList.find(
        (product) => product.productName === selectedProductName
      );
      setDateRange(selectedProduct);
    }
  };

  const handleExpDateChange = (date) => {
    setExpDate(date);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentData = {
      amount: selectedProductPrice,
      buyer_email: userData.email,
      buyer_name: userData.userName,
      merchantUid: `mid_${new Date().getTime()}`,
      name: selectedProductName,
    };

    try {
      const paymentResponse = await requestPayment(paymentData);
      console.log("Payment response:", paymentResponse);

      if (paymentResponse.success) {
        setImpUid(paymentResponse.impUid);
        await handleModify(paymentResponse); // 결제 성공 후 회원 정보 수정 처리
      } else {
        console.log("Payment failed:", paymentResponse.error_msg);
      }
    } catch (error) {
      console.error("Payment process failed:", error);
    }
  };
  const handleModify = async (paymentResponse) => {
    try {
      if (!location.state) {
        console.log("no gym");
        console.log("no gym");
        return;
      }

      const updateRes = await updateUserInfo(userData);

      const membershipData = {
        ...userData,
        userGender,
        userAge,
        regDate: formatDate(regDate),
        expDate: formatDate(expDate),
        selectedProductName,
        gymId: gym.gymId,
        userMemberReason,
        userWorkoutDuration,
        productId,
        impUid: paymentResponse.impUid,
        merchantUid: paymentResponse.merchantUid,
      };

      // Register membership
      const res = await registerMembership(membershipData);
      console.log("Membership registered successfully:", res);

      // Set alert modal visible
      setIsAlertModalVisible(true);
    } catch (error) {
      console.error("Failed to register membership:", error);
    }
  };

  const handleConfirmClick = async () => {
    setIsAlertModalVisible(false);
    await fetchUserData();
    customNavigate("/centerView", { state: { gym: gym }, replace: true });
  };

  // 최종결제금액 표시 코드 수정
  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR'); // 원 단위로 표시하는 함수
  };

  return (
    <>
      <div className="flex flex-col items-center min-h-screen justify-center p-20">

        <div className="flex flex-col items-center w-fit py-10 bg-white rounded-[55px] px-5">
          <p className="font-semibold text-xl px-8 py-2 bg-yellow-500 bg-opacity-15 rounded-full">회원권 등록</p>
          <div className="border-y-4 border-[#f7f5f2]  mt-4">
            <div className="flex flex-row justify-center items-center mt-3 relative ">
              {/* <div
          className={` ${
            isExpanded
              ? "text-6xl absolute left-1/4 top-0"
              : "text-6xl absolute left-1/3 top-0"
          } `}
        > */}
              {/* <div
          className={` ${
            isExpanded
              ? "text-6xl absolute left-1/4 top-0"
              : "text-6xl absolute left-1/3 top-0"
          } `}
        >
          🏋🏻
        </div> */}

              <div
                className={`m-10 ${isExpanded
                  ? "w-[1700px] justify-center space-x-10 px-20 relative "
                  : "w-[500px] justify-center"
                  } h-[550px] flex items-center`}
              >
                <div className="flex flex-row items-start space-x-6">
                  <div className="flex justify-between space-x-7">
                    <div className="x-[400px] space-y-7">
                      {/* 이름 */}
                      <div className="flex flex-row items-center space-x-6 ">
                        <div className="text-lg pr-3 mr-3 border-r-2 border-grayish-red">
                          이름
                        </div>
                        <Input
                          width="278px"
                          name="userName"
                          value={userData.userName}
                          readOnly={true}
                        />
                      </div>


                      <div className="flex w-full relative justify-between ">
                        {/* 성별 */}
                        {/* <label
                className={`absolute -top-2 px-2 text-xs pointer-events-none text-gray-400`}
              >
                성별
              </label> */}
                        <div className="flex flex-row items-center space-x-5 ">
                          <div className="text-lg pr-3 border-r-2 border-grayish-red">
                            성별
                          </div>

                          <div className="relative">
                            <select
                              onFocus={handleGenderFocus}
                              onBlur={handleGenderBlur}
                              type="button"
                              className={`h-11 py-3 px-4 w-[100px] appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm ${genderFocus ? "border-peach-fuzz" : "border-gray-400"
                                } focus:border-2 focus:outline-none text-sm peer my-2 `}
                              value={userGender}
                              onChange={handleChangeGender}
                            >
                              <option value="남자">남자</option>
                              <option value="여자">여자</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              {!genderFocus ? (
                                <FaChevronDown className="text-gray-400" />
                              ) : (
                                <FaChevronUp className="text-gray-400" />
                              )}
                            </div>
                          </div>

                        </div>


                        {/* 나이 */}
                        {/* <label
                className={`absolute right-28 -top-2 px-2 text-xs pointer-events-none text-gray-400`}
              >
                나이
              </label> */}
                        <div className="flex flex-row items-center space-x-5 ">
                          <div className="text-lg pr-3 border-r-2 border-grayish-red">
                            나이
                          </div>
                          <div className="relative">
                            <select
                              onFocus={handleAgeFocus}
                              onBlur={handleAgeBlur}
                              type="button"
                              className={`h-11 py-3 px-4 w-[100px] overflow-y-auto appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm  ${ageFocus ? "border-peach-fuzz" : "border-gray-400"
                                } focus:border-2 focus:outline-none text-sm peer my-2 `}
                              value={userAge}
                              onChange={handleChangeAge}
                            >
                              {ageOptions}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              {!ageFocus ? (
                                <FaChevronDown className="text-gray-400" />
                              ) : (
                                <FaChevronUp className="text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 이메일 */}


                      <div className="flex flex-row items-center space-x-6 ">
                        <div className="text-lg pr-3 mr-3 border-r-2 border-grayish-red">
                          이메일
                        </div>
                        <Input
                          width="260px"
                          name="email"
                          value={userData.email}
                          readOnly={true}
                        />
                      </div>

                      {/* 주소 */}

                      <div className="flex flex-row items-center space-x-6 ">
                        <div className="text-lg pr-3 mr-3 border-r-2 border-grayish-red">
                          주소
                        </div>
                        <Input
                          width="278px"
                          name="address"
                          value={userData.address}
                          onChange={handleUserDataChange}
                          readOnly={true}
                          feature="검색"
                          featureOnClick={() => setIsAddressModalVisible(true)}
                          featureEnableOnLoad={true}
                        />
                      </div>

                      <div className="flex flex-row items-center space-x-6 ">
                        <div className="text-lg pr-3 mr-3 border-r-2 border-grayish-red">
                          상세주소
                        </div>
                        <Input
                          width="243px"
                          name="detailAddress"
                          value={userData.detailAddress}
                          onChange={handleUserDataChange}
                        />
                      </div>
                    </div>
                  </div>
                  {isExpanded && (

                    <div className=" flex flex-col items-start space-y-7">
                      {/* 헬스권  */}
                      <div className="dropdown relative">
                        <div className="flex flex-row items-center space-x-6 my-2 ">
                          <div className="text-lg pr-3 mr-3 border-r-2 border-grayish-red">
                            상품이름
                          </div>
                          {/* <label
                  className={`absolute right-30 -top-4 px-2 text-xs pointer-events-none text-gray-400`}
                >
                  상품이름
                </label> */}
                          <button
                            onClick={toggleDropdown}
                            className="w-[263px] h-11 flex justify-between items-center border border-gray-400 rounded-lg p-2 "
                          >
                            {selectedProductName}
                            <BsChevronDown />
                          </button>
                          {isDropdownOpen && (
                            <ul className="absolute w-full border border-gray-400 rounded-lg list-none z-10 bg-white">
                              {gym.productList
                                .filter((product) => product.status !== false)
                                .sort((a, b) => a.days - b.days)
                                .map((product) => (
                                  <li
                                    key={product.productId}
                                    className="px-2 py-1 rounded-md hover:bg-grayish-red hover:bg-opacity-30"
                                    onClick={() =>
                                      onClickPeriod({
                                        target: { value: product.productName },
                                      })
                                    }
                                  >
                                    {product.productName}
                                  </li>
                                ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row relative items-center justify-between">
                        {/* 등록일 만료일 */}
                        <div className="flex flex-row items-center space-x-2 ">
                          <div className="flex items-center my-2">
                            <div className="text-lg pr-3 mr-8 border-r-2 border-grayish-red">
                              기간
                            </div>

                            {/* <label
                    className={`absolute w-16 right-27 -top-4 px-2 text-xs pointer-events-none text-gray-400`}
                  >
                    등록일
                  </label> */}
                            <CustomDatePicker
                              label="등록일"
                              selectedDate={regDate}
                              handleDateChange={handleRegDateChange}
                            />
                          </div>
                          <span>-</span>
                          <div className="">
                            {/* <label
                    className={`absolute w-16 right-27 -top-4 px-2 text-xs pointer-events-none text-gray-400`}
                  >
                    만료일
                  </label> */}
                            <CustomDatePicker
                              label="만료일"
                              selectedDate={expDate}
                              handleDateChange={handleExpDateChange}
                            />
                          </div>
                        </div>
                      </div>

                      {/* 신청사유 */}

                      <div className="flex flex-row space-x-4">
                        <div className="relative">
                          <div className="flex flex-row items-center space-x-6 ">
                            <div className="text-lg pr-3 mr-3 border-r-2 border-grayish-red">
                              신청사유
                            </div>
                            {/* <label
                    className={`absolute -top-2  px-2 text-xs pointer-events-none text-gray-400`}
                  >
                    신청사유
                  </label> */}
                            <select
                              onFocus={handleMemberReasonFocus}
                              onBlur={handleMemberReasonBlur}
                              type="button"
                              className={`h-11 py-3 px-4 w-[263px] appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm font-semibold ${userMemberReasonFocus
                                ? "border-peach-fuzz"
                                : "border-gray-400"
                                } focus:border-2 focus:outline-none text-sm peer my-2 `}
                              value={userMemberReason}
                              onChange={handleChangeMemberReason}
                            >
                              <option value="PT">PT</option>
                              <option value="다이어트">다이어트</option>
                              <option value="건강">건강</option>
                              <option value="바디프로필">바디프로필</option>
                              <option value="체형관리">체형관리</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                              {!userMemberReasonFocus ? (
                                <FaChevronDown className="text-gray-400" />
                              ) : (
                                <FaChevronUp className="text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                      <div className="relative">
                        <div className="flex flex-row items-center space-x-6 ">
                          <div className="text-lg pr-3 mr-3 border-r-2 border-grayish-red">
                            운동경력(선택)
                          </div>
                          {/* 운동경력(선택) */}
                          {/* <label
                    className={`absolute right-30 -top-2 px-2 text-xs pointer-events-none text-gray-400`}
                  >
                    운동경력(선택)
                  </label> */}

                          <select
                            onFocus={handleWorkoutDurationFocus}
                            onBlur={handleWorkoutDurationBlur}
                            type="button"
                            className={`h-11 py-3 px-4 w-[216px] overflow-y-auto appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm font-semibold ${userWorkoutDurationFocus
                              ? "border-peach-fuzz"
                              : "border-gray-400"
                              } focus:border-2 focus:outline-none text-sm peer my-2 `}
                            value={userWorkoutDuration}
                            onChange={handleChangeWorkoutDuration}
                          >
                            {WorkoutDurationOptions}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            {!userWorkoutDurationFocus ? (
                              <FaChevronDown className="text-gray-400" />
                            ) : (
                              <FaChevronUp className="text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* <div className="space-y-2 w-full flex flex-col border-y-2 border-grayish-red border-opacity-25 p-4">
                    <div className="flex flex-row justify-between">
                        <div className="text-base font-semibold">
                          상품명
                        </div>
                        <div className="text-base">{selectedProductName}</div>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="text-xl font-semibold">
                          최종결제금액
                        </div>
                        <div className="text-lg">{formatPrice(selectedProductPrice)}원</div>
                      </div>
                    </div> */}


                      <div className="flex flex-col items-end absolute right-10 bottom-5">
                        <div className="divide-y divide-dashed space-y-2 w-[300px] flex flex-col border-y-2 border-grayish-red border-opacity-25 p-4">
                          <div className="flex flex-row justify-between">
                            <div className="text-base font-semibold">
                              상품명
                            </div>
                            <div className="text-base">{selectedProductName}</div>
                          </div>
                          {/* @@@@@@@@@상품 가격 표시 */}
                          {/* @@@@@@@@@상품 가격 표시 */}
                          {/* @@@@@@@@@상품 가격 표시 */}
                          {/* @@@@@@@@@상품 가격 표시 */}
                          <div className="flex flex-row justify-between pt-2">
                            <div className="text-xl font-semibold">
                              최종결제금액
                            </div>
                            <div className="text-lg">{formatPrice(selectedProductPrice)}원</div>
                          </div>
                        </div>
                        <div className="ml-3">
                          <button
                            onClick={handleSubmit}
                            className="flex items-center text-lg text-grayish-red  hover:font-semibold "
                          >
                            <div className="mb-4 text-3xl">💳</div> 결제하기
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {!isExpanded && (
                <button onClick={toggleExpand}>
                  <FaAngleDoubleRight className=" mx-auto animate-[propel_3s_infinite]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isAddressModalVisible && (
        <AddressModal
          userData={userData}
          setUserData={setUserData}
          toggleModal={() => setIsAddressModalVisible(false)}
        />
      )}
      {isAlertModalVisible && (
        <AlertModal
          headerEmoji={"✔️"}
          line1={"헬스장 등록이 완료되었습니다!"}
          button2={{
            label: "확인",
            onClick: handleConfirmClick,
          }}
        />
      )}
      {/* {hasNoProduct && (
        <AlertModal
          headerEmoji={"⚠️"}
          line1={"등록 할 수 있는 상품이 없습니다."}
          button2={{
            label: "확인",
            onClick: () =>
              customNavigate("/centerView", {
                state: { gym: gym },
                replace: true,
              }),
          }}
        />
      )} */}
    </>
  );
};

export default MemberRegister;
