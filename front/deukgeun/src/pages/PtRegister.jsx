import React, { useState, useEffect } from "react";
import Input from "../components/shared/Input";
import AddressModal from "../components/modals/AddressModal";
import useValidation from "../hooks/useValidation";
import CustomDatePicker from "../components/shared/DatePicker";
import formatDate from "../components/shared/FormatDate";
import { registerMembership, findMembership } from "../api/membershipApi";
import { registerPT } from "../api/ptApi";

import { FaAngleDoubleDown, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaAngleDoubleRight } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { GiArchiveRegister } from "react-icons/gi";
import AlertModal from "../components/modals/AlertModal";
import { useAuth } from "../context/AuthContext";
import { updateUserInfo } from "../api/userInfoApi";
import Button from "../components/shared/Button";
import useCustomNavigate from "../hooks/useCustomNavigate";
import { useLocation } from "react-router-dom";
import useIamport from "../hooks/useIamport";

const PtRegister = () => {
  const location = useLocation();
  const [gym, setGym] = useState(location.state ? location.state.gym : "");
  const [genderFocus, setGenderFocus] = useState(false);
  const [ageFocus, setAgeFocus] = useState(false);
  const [timeFocus, setTimeFocus] = useState(false);
  const [userMemberReasonFocus, setMemberReasonFocus] = useState(false);
  const [userWorkoutDurationFocus, setWorkoutDurationFocus] = useState(false);

  const handleGenderFocus = () => setGenderFocus(true);
  const handleGenderBlur = () => setGenderFocus(false);
  const handleAgeFocus = () => setAgeFocus(true);
  const handleAgeBlur = () => setAgeFocus(false);
  const handleTimeFocus = () => setTimeFocus(true);
  const handleTimeBlur = () => setTimeFocus(false);
  const handleMemberReasonFocus = () => setMemberReasonFocus(true);
  const handleMemberReasonBlur = () => setMemberReasonFocus(false);
  const handleWorkoutDurationFocus = () => setWorkoutDurationFocus(true);
  const handleWorkoutDurationBlur = () => setWorkoutDurationFocus(false);

  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isTraineDropdownOpen, setIsTrainerDropdownOpen] = useState(false);
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
  const [selectedTrainer, setSelectedTrainer] = useState(
    gym.trainerList && gym.trainerList.length > 0
      ? gym.trainerList[0].user.userName
      : ""
  );
  const { validateInput } = useValidation();

  const { userData, setUserData } = useAuth();
  const [userGender, setUserGender] = useState("남자"); //성별
  const [userAge, setUserAge] = useState(20); //나이
  const [selectedTime, setSelectedTime] = useState(); //선택한 PT시간 (PTSession에 StartTime, EndTime)
  const [regDate, setRegDate] = useState(new Date()); //시작일
  const [expDate, setExpDate] = useState(new Date()); //만료일
  const [userMemberReason, setUserMemberReason] = useState("PT");
  const [userWorkoutDuration, setUserWorkoutDuration] = useState(0);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    if (gym.productList && gym.productList.length > 0) {
      const initialProduct = location.state?.product || gym.productList[0];
      setSelectedProductName(initialProduct.productName);
      setSelectedProductPrice(initialProduct.price);
      setProductId(initialProduct.productId);
    }
  }, [gym.productList]);
  const [trainerId, setTrainerId] = useState(
    gym.trainerList && gym.trainerList.length > 0
      ? gym.trainerList[0].trainerId
      : ""
  );
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [impUid, setImpUid] = useState(""); // 여기에 imp_uid를 저장합니다.
  const [merchantUid, setMerchantUid] = useState("");
  const { requestPayment, verifyPayment, loading, error } = useIamport();

  const customNavigate = useCustomNavigate();
  const { fetchUserData } = useAuth();

  useEffect(() => {
    console.log("location state", location.state);
    if (!gym.productList || gym.productList.length === 0) {
      setHasNoProduct(true);
    } else {
      filterProducts();
    }
  }, []);

  const filterProducts = () => {
    const filteredProductList =
      gym.productList?.filter((product) => product.ptCountTotal > 0) || [];
    const updatedGym = { ...gym, productList: filteredProductList };
    setGym(updatedGym);
    if (filteredProductList.length > 0) {
      setSelectedProductName(
        location.state?.product?.productName ||
          filteredProductList[0].productName
      );
      setSelectedProductPrice(
        location.state?.product?.price || filteredProductList[0].price
      );
      setProductId(
        location.state?.product?.productId || filteredProductList[0].productId
      );
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

  const handleChangeTime = (event) => {
    setSelectedTime(event.target.value);
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
        {WorkoutDuration}
      </option>
    );
  }

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      const startTime = hour.toString().padStart(2, "0");
      const endTime = ((hour + 1) % 24).toString().padStart(2, "0");
      options.push(
        <option
          key={startTime}
          value={`${startTime}:00 - ${endTime}:00`}
        >{`${startTime}:00 - ${endTime}:00`}</option>
      );
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const toggleTrainerDropdown = () => {
    setIsTrainerDropdownOpen((prev) => !prev);
  };
  
  const onClickPeriod = (product) => {
    console.log("Selected product:", product);
    if (product) {
      setSelectedProductName(product.productName);
      setSelectedProductPrice(product.price);
      setProductId(product.productId);
      setDateRange(product);
      console.log("Updated product:", product);
    } else {
      console.log("Product not found");
    }
    setIsDropdownOpen(false);
  };
  useEffect(() => {
    if (productId && gym.productList) {
      const selectedProduct = gym.productList.find(
        (product) => product.productId === productId
      );
      if (selectedProduct) {
        setSelectedProductName(selectedProduct.productName);
        setSelectedProductPrice(selectedProduct.price);
        setDateRange(selectedProduct);
        console.log("Updated product in effect:", selectedProduct);
      }
    }
  }, [productId, gym.productList]);
  const onClickTrainer = (e) => {
    const { value } = e.target;
    const selectedTrainer = gym.trainerList.find(
      (trainer) => trainer.user.userName === value
    );
    setSelectedTrainer(value);
    setTrainerId(selectedTrainer.trainerId);
    console.log(trainerId);
    toggleTrainerDropdown(); // 드롭다운 닫기
  };

  const setDateRange = (product) => {
    const today = new Date();
    let endDate = new Date(regDate);
    endDate.setDate(endDate.getDate() + product.days);
    setExpDate(endDate);
  };

  // useEffect(() => {
  //   if (gym.productList && gym.productList.length > 0) {
  //     const initialProduct = gym.productList.find(
  //       (product) => product.productName === selectedProductName
  //     );
  //     setDateRange(initialProduct);
  //   }
  // }, [regDate, selectedProductName, gym.productList]);
  

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

  //만료일변경
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
    console.log(paymentData);
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
      const updateRes = await updateUserInfo(userData);
      console.log(updateRes);

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
      console.log(membershipData);

      // Register membership and get the membershipId from the response
      const membershipResponse = await registerMembership(membershipData);
      const membership = await findMembership();
      const membershipId = membership.membershipId;

      // Find the selected product to get ptCountTotal
      const selectedProduct = gym.productList.find(
        (product) => product.productName === selectedProductName
      );

      const PTData = {
        userId: userData.userId,
        membershipId,
        ptContent: selectedProductName,
        ptCountRemain: selectedProduct.ptCountTotal,
        ptCountTotal: selectedProduct.ptCountTotal,
        trainerId,
        userPtReason: userMemberReason,
        impUid: paymentResponse.impUid,
        merchantUid: paymentResponse.merchantUid,
      };
      const ptRequestData = {
        membershipDTO: membershipData,
        personalTrainingDTO: PTData,
      };
      console.log(PTData);
      // Register PT
      const PTResponse = await registerPT(ptRequestData);

      console.log("Membership registered successfully:", membershipResponse);
      console.log("PT registered successfully:", PTResponse);

      setIsAlertModalVisible(true);
    } catch (error) {
      console.error("Failed to register membership or PT:", error);
    }
  };

  const handleConfirmClick = async () => {
    setIsAlertModalVisible(false);
    await fetchUserData();
    customNavigate("/centerView", { state: { gym: gym }, replace: true });
  };

  return (
    <>
      <div className="flex flex-col my-8 items-center relative">
        <div className="text-6xl absolute left-1/4">🏋🏻</div>
        <div className="flex flex-row items-center">
          <div
            className={`m-8 max-h-[590px] transition-max-height duration-500 overflow-hidden ${
              isExpanded ? "h-[700px]" : "h-[400px]"
            } w-[800px] space-x-10 px-20 justify-center flex items-center border-y-8 border-dotted border-peach-fuzz border-opacity-50`}
          >
            <div className="flex flex-col items-center space-y-7 ">
              <p className="font-semibold text-xl">PT 등록</p>
              <div className="flex justify-between space-x-7">
                <div className="x-[400px] space-y-7">
                  {/* 이름 */}
                  <Input
                    label="이름"
                    width="320px"
                    name="userName"
                    value={userData.userName}
                    readOnly={true}
                  />
                  {/* 이메일 */}
                  <Input
                    label="이메일"
                    width="320px"
                    name="email"
                    value={userData.email}
                    readOnly={true}
                  />
                  <div className="flex flex-row items-center space-x-5 ">
                    {/* 상품 */}
                    <div className="dropdown relative">
                      <label
                        className={`absolute -top-4 px-2 text-xs pointer-events-none text-gray-400`}
                      >
                        상품이름
                      </label>
                      <button
                        onClick={toggleDropdown}
                        className=" h-11 w-[150px] flex text-sm justify-between items-center border border-gray-400 rounded-lg px-4 py-3"
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
                                  onClickPeriod(product)
                                }
                              >
                                {product.productName}
                              </li>
                            ))}
                        </ul>
                      )}
                    </div>
                    {/* 트레이너 */}
                    <div className="dropdown relative">
                      <label
                        className={`absolute -top-4 px-2 text-xs pointer-events-none text-gray-400`}
                      >
                        트레이너
                      </label>
                      <button
                        onClick={toggleTrainerDropdown}
                        className=" h-11 w-[150px] flex text-sm justify-between items-center border border-gray-400 rounded-lg px-4 py-3"
                      >
                        {selectedTrainer}
                        <BsChevronDown />
                      </button>
                      {isTraineDropdownOpen && (
                        <ul className="absolute w-full border border-gray-400 rounded-lg list-none z-10 bg-white">
                          {gym.trainerList.map((trainer) => (
                            <li
                              key={trainer.trainerId}
                              className="px-2 py-1 rounded-md hover:bg-grayish-red hover:bg-opacity-30"
                              onClick={() =>
                                onClickTrainer({
                                  target: { value: trainer.user.userName },
                                })
                              }
                            >
                              {trainer.user.userName}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-row items-center space-x-4">
                    {/* 시작일 */}

                    <div className="relative">
                      <label
                        className={`absolute w-16 right-27 -top-4 px-2 text-xs pointer-events-none text-gray-400`}
                      >
                        등록일
                      </label>
                      <CustomDatePicker
                        label="등록일"
                        selectedDate={regDate}
                        handleDateChange={handleRegDateChange}
                      />
                    </div>
                    <span>-</span>
                    {/* 만료일 */}
                    <div className="relative">
                      <label
                        className={`absolute w-16 right-27 -top-4 px-2 text-xs pointer-events-none text-gray-400`}
                      >
                        만료일
                      </label>
                      <CustomDatePicker
                        label="만료일"
                        selectedDate={expDate}
                        handleDateChange={handleExpDateChange}
                      />
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="flex">
                      <div className="relative">
                        <label
                          className={`absolute -top-2 px-2 text-xs pointer-events-none text-gray-400`}
                        >
                          신청사유
                        </label>
                        <select
                          onFocus={handleMemberReasonFocus}
                          onBlur={handleMemberReasonBlur}
                          type="button"
                          className={`h-11 py-3 px-4 w-[150px] appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm font-semibold ${
                            userMemberReasonFocus
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
                  )}
                </div>

                <div className="x-[400px] space-y-7">
                  <div className="flex flex-row items-center space-x-5">
                    {/* 성별 */}
                    <div className="relative">
                      <label
                        className={`absolute -top-2 px-2 text-xs pointer-events-none text-gray-400`}
                      >
                        성별
                      </label>

                      <select
                        onFocus={handleGenderFocus}
                        onBlur={handleGenderBlur}
                        type="button"
                        className={`h-11 py-3 px-4 w-[150px]  appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm ${
                          genderFocus ? "border-peach-fuzz" : "border-gray-400"
                        } focus:border-2 focus:outline-none text-sm peer mt-2 `}
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
                    {/* 나이 */}
                    <div className="relative">
                      <label
                        className={`absolute w-10 right-26 -top-2 px-2 text-xs pointer-events-none text-gray-400`}
                      >
                        나이
                      </label>

                      <select
                        onFocus={handleAgeFocus}
                        onBlur={handleAgeBlur}
                        type="button"
                        className={`h-11 py-3 px-4 w-[150px] overflow-y-auto appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm ${
                          ageFocus ? "border-peach-fuzz" : "border-gray-400"
                        } focus:border-2 focus:outline-none text-sm peer mt-2 `}
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
                  <div>
                    {/* 주소 */}
                    <Input
                      label="주소"
                      width="320px"
                      name="address"
                      value={userData.address}
                      onChange={handleUserDataChange}
                      readOnly={true}
                      feature="검색"
                      featureOnClick={() => setIsAddressModalVisible(true)}
                      featureEnableOnLoad={true}
                      required={true}
                    />
                  </div>
                  <div>
                    <Input
                      label="세부주소"
                      width="320px"
                      name="detailAddress"
                      value={userData.detailAddress}
                      onChange={handleUserDataChange}
                      required={true}
                    />
                  </div>
                  <div className="flex">
                    {/* PT시간 */}
                    <div className="relative">
                      <label
                        className={`absolute w-10 right-26 -top-4 px-2 text-xs pointer-events-none text-gray-400`}
                      >
                        시간
                      </label>
                      <select
                        onFocus={handleTimeFocus}
                        onBlur={handleTimeBlur}
                        type="button"
                        className={`h-11 py-3 px-4 w-[150px] overflow-y-auto appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm ${
                          timeFocus ? "border-peach-fuzz" : "border-gray-400"
                        } focus:border-2 focus:outline-none text-sm peer `}
                        value={selectedTime}
                        onChange={handleChangeTime}
                      >
                        {timeOptions}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {!timeFocus ? (
                          <FaChevronDown className="text-gray-400" />
                        ) : (
                          <FaChevronUp className="text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>
                  {isExpanded && (
                    <>
                      <div className="flex">
                        <div className="relative ">
                          <label
                            className={`absolute right-30 -top-2 px-2 text-xs pointer-events-none text-gray-400`}
                          >
                            운동경력(선택)
                          </label>
                          <select
                            onFocus={handleWorkoutDurationFocus}
                            onBlur={handleWorkoutDurationBlur}
                            type="button"
                            className={`h-11 py-3 px-4 w-[150px] overflow-y-auto appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm font-semibold ${
                              userWorkoutDurationFocus
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
                      <div className="flex flex-row items-center float-end">
                        {/* @@@@@@@@@상품 가격 표시 */}
                        {/* @@@@@@@@@상품 가격 표시 */}
                        {/* @@@@@@@@@상품 가격 표시 */}
                        {/* @@@@@@@@@상품 가격 표시 */}
                        <div>{selectedProductPrice}원</div>
                        <div className="ml-3">
                          <button
                            onClick={handleSubmit}
                            className="flex items-center text-lg text-grayish-red hover:border-b  hover:font-semibold mx-auto animate-bounce"
                          >
                            <div className="mb-4 text-3xl">💳</div> 결제하기
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {!isExpanded && (
          <button onClick={toggleExpand}>
            <FaAngleDoubleDown className="mx-auto animate-bounce" />
          </button>
        )}
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
          line1={"PT권 등록이 완료되었습니다!"}
          button2={{
            label: "확인",
            onClick: handleConfirmClick,
          }}
        />
      )}
      {hasNoProduct && (
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
      )}
    </>
  );
};

export default PtRegister;
