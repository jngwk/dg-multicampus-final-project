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
  const [selectedPeriod, setSelectedPeriod] = useState(
    gym.productList && gym.productList.length > 0
      ? gym.productList[0].productName
      : ""
  ); //선택상품
  const [selectedProductPrice, setSelectedProductPrice] = useState(
    gym.productList && gym.productList.length > 0 ? gym.productList[0].price : 0
  );
  const [selectedTrainer, setSelectedTrainer] = useState(
    gym.trainersList && gym.trainersList.length > 0
      ? gym.trainersList[0].userName
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
  const [userWorkoutDuration, setUserWorkoutDuration] = useState(1);
  const [productId, setProductId] = useState(
    gym.productList && gym.productList.length > 0
      ? gym.productList[0].productId
      : ""
  );
  const [trainerId, setTrainerId] = useState(
    gym.trainersList && gym.trainersList.length > 0
      ? gym.trainersList[0].trainerId
      : ""
  );

  const customNavigate = useCustomNavigate();
  const { fetchUserData } = useAuth();

  // useEffect(( ) => {console.log(gym)});

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

  const onClickPeriod = (e) => {
    const { value } = e.target;
    const selectedProduct = gym.productList.find(
      (product) => product.productName === value
    );
    setSelectedPeriod(value);
    setSelectedProductPrice(selectedProduct.price);
    setProductId(selectedProduct.productId);
    setDateRange(selectedProduct);
    setIsDropdownOpen(); // 드롭다운 닫기
  };

  const onClickTrainer = (e) => {
    const { value } = e.target;
    const selectedTrainer = gym.trainersList.find(
      (trainer) => trainer.userName === value
    );
    setSelectedTrainer(value);
    setTrainerId(selectedTrainer.trainerId);
    toggleTrainerDropdown(); // 드롭다운 닫기
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
        (product) => product.productName === selectedPeriod
      );
      setDateRange(initialProduct);
    }
  }, [regDate, selectedPeriod, gym.productList]);

  const handleRegDateChange = (date) => {
    const today = new Date();
    if (date < today) {
      alert("시작일은 오늘보다 이전일 수 없습니다.");
      return;
    } else {
      setRegDate(date);
      const selectedProduct = gym.productList.find(
        (product) => product.productName === selectedPeriod
      );
      setDateRange(selectedProduct);
    }
  };

  //만료일변경
  const handleExpDateChange = (date) => {
    setExpDate(date);
  };

  const handleModify = async () => {
    try {
      const updateRes = await updateUserInfo(userData);
      console.log(updateRes);

      const membershipData = {
        ...userData,
        userGender,
        userAge,
        regDate: formatDate(regDate),
        expDate: formatDate(expDate),
        selectedPeriod,
        gymId: gym.gymId,
        userMemberReason,
        userWorkoutDuration,
        productId,
      };
      console.log(membershipData);

      // Register membership and get the membershipId from the response
      const membershipResponse = await registerMembership(membershipData);
      const membership = await findMembership();
      const membershipId = membership.membershipId;

      // Find the selected product to get ptCountTotal
      const selectedProduct = gym.productList.find(
        (product) => product.productName === selectedPeriod
      );

      const PTData = {
        userId: userData.userId,
        membershipId,
        ptContent: selectedPeriod,
        ptCountRemain: selectedProduct.ptCountTotal,
        ptCountTotal: selectedProduct.ptCountTotal,
        trainerId,
        userPtReason: userMemberReason,
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
      <div className="flex flex-col my-10 items-center relative">
        <GiArchiveRegister
          className="absolute left-1/4 w-20 h-20 z-50"
          color="#9F8D8D"
        />
        <div className="flex flex-row items-center">
          <div
            className={`m-10 max-h-[600px] transition-max-height duration-500 overflow-hidden ${
              isExpanded ? "h-[700px]" : "h-[400px]"
            } w-[800px] space-x-10 px-20 justify-center rounded-lg flex items-center border-2 border-peach-fuzz`}
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
                        {selectedPeriod}
                        <BsChevronDown />
                      </button>
                      {isDropdownOpen && (
                        <ul className="absolute w-full border border-gray-400 rounded-lg list-none z-10 bg-white">
                          {gym.productList.map((product) => (
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
                          {gym.trainersList.map((trainer) => (
                            <li
                              key={trainer.trainerId}
                              className="px-2 py-1 rounded-md hover:bg-grayish-red hover:bg-opacity-30"
                              onClick={() =>
                                onClickTrainer({
                                  target: { value: trainer.userName },
                                })
                              }
                            >
                              {trainer.userName}
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
                        <div >{selectedProductPrice}원</div>
                        <div className="ml-3">
                          <Button
                            width="120px"
                            color="peach-fuzz"
                            label="등록"
                            onClick={handleModify}
                          />
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


        {isExpanded && (
          <button className="mt-2 text-lg text-grayish-red hover:border-b hover:border-gray-400 hover:font-semibold mx-auto animate-bounce" >
          <box-icon name='wallet-alt' color="#9F8D8D" size="sm"></box-icon>
            결제하기
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
    </>
  );
};

export default PtRegister;
