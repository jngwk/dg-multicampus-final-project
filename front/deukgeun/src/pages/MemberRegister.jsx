import React, { useState, useEffect } from "react";
import Input from "../components/shared/Input";
import AddressModal from "../components/modals/AddressModal";
import useValidation from "../hooks/useValidation";
import CustomDatePicker from "../components/shared/DatePicker";
import formatDate from "../components/shared/FormatDate";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaAngleDoubleRight } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import TextArea from "../components/shared/TextArea";
import { useAuth } from "../context/AuthContext";
import { registerMembership } from "../api/membershipApi";
import AlertModal from "../components/modals/AlertModal";
import { updateUserInfo } from "../api/userInfoApi";
import { useLocation } from "react-router-dom";
import useCustomNavigate from "../hooks/useCustomNavigate";
import Button from "../components/shared/Button";

// 회원 정보
const initUserData = {
  userName: "",
  email: "",
  password: "",
  address: "",
  detailAddress: "",
};

// 신청사유와 운동경력
const initState = {
  userMemberReason: "",
  userWorkoutDuration: "",
};

// 상품 기간
const period = [
  { id: "ALL", name: "전체" },
  { id: "1W", name: "1주일" },
  { id: "1M", name: "1개월" },
  { id: "3M", name: "3개월" },
  { id: "6M", name: "6개월" },
];

const MemberRegister = ({ membershipData }) => {
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
  const [selectedPeriod, setSelectedPeriod] = useState(period[3].name); //선택상품
  const { validateInput } = useValidation();

  const {userData, setUserData} = useAuth();
  const [userGender, setUserGender] = useState("남자"); //성별
  const [userAge, setUserAge] = useState(20); //나이
  const [regDate, setRegDate] = useState(new Date()); //시작일
  const [expDate, setExpDate] = useState(new Date()); //만료일
  const [userMemberReason, setUserMemberReason] = useState("PT");
  const [userWorkoutDuration, setUserWorkoutDuration] = useState("");
  const [productId, setProductId] = useState(1);
  const customNavigate = useCustomNavigate();

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
  for (let age = 8; age <= 90; age++) {
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

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const onClickPeriod = (e) => {
    //상품클릭
    const { value } = e.target;
    setSelectedPeriod(value);
    setDateRange(value);
    toggleDropdown();
  };

  const setDateRange = (period) => {
    let start = new Date(regDate);

    if (period === "1주일") {
      start.setDate(start.getDate() + 7);
    } else if (period.includes("개월")) {
      start.setMonth(start.getMonth() + Number(period[0]));
    } else {
      start.setMonth(start.getMonth() + 3);
    }

    setExpDate(start);
  };

  useEffect(() => {
    setDateRange(selectedPeriod);
  }, [regDate, selectedPeriod]);

  const handleRegDateChange = (date) => {
    const today = new Date();
    if (date < today) {
      alert("시작일은 오늘보다 이전일 수 없습니다.");
      return;
    } else {
      setRegDate(date);
      setDateRange(selectedPeriod);
    }
  };

  const handleExpDateChange = (date) => {
    setExpDate(date);
  };

  const handleModify = async () => {
    try {
      if (location.state) {
        const gym = location.state.gym;
      } else {
        console.log("no gym");
        return;
      }

      const updateRes = await updateUserInfo(userData);
      console.log(updateRes);
      const membershipData = {
        ...userData,
        userGender,
        userAge,
        regDate: formatDate(regDate), // product에서 days가 존재하는데 거기에 필요
        expDate: formatDate(expDate),
        selectedPeriod, //productName이 될예정(?)
        gymId: gym.gymId,
        userMemberReason,
        userWorkoutDuration,
        productId: 1, // productId가 들어가도록 해야함 추후 수정 해야함
      };
      const res = await registerMembership(membershipData);
      console.log("Membership registered successfully:", res);
      setIsAlertModalVisible(true);
      customNavigate("/gymSearch", { replace: true });
    } catch (error) {
      console.error("Failed to register membership:", error);
    }
  };

  const handleConfirmClick = async () => {
    setIsAlertModalVisible(false);
    // await fetchUserData();
  };

  return (
    <>
      <div className="flex flex-row items-center">
        <div
          className={`m-10 ${
            isExpanded
              ? "w-[1000px] justify-between space-x-10 px-20"
              : "w-[500px] justify-center"
          } h-[550px] rounded-lg flex items-center border-2 border-peach-fuzz`}
        >
          <div className="flex flex-col items-center space-y-6">
            <p className="font-semibold text-xl">헬스권 등록</p>
            {/* 이름 */}
            <Input
              label="이름"
              width="320px"
              name="userName"
              value={userData.userName}
              readOnly={true}
            />

            <div className="flex w-full relative justify-between ">
              {/* 성별 */}
              <label
                className={`absolute -top-2 px-2 text-xs pointer-events-none text-gray-400`}
              >
                성별
              </label>
              <div className="relative">
                <select
                  onFocus={handleGenderFocus}
                  onBlur={handleGenderBlur}
                  type="button"
                  className={`h-11 py-3 px-4 w-[150px] appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm font-semibold ${
                    genderFocus ? "border-peach-fuzz" : "border-gray-400"
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
              {/* 나이 */}
              <label
                className={`absolute right-28 -top-2 px-2 text-xs pointer-events-none text-gray-400`}
              >
                나이
              </label>
              <div className="relative">
                <select
                  onFocus={handleAgeFocus}
                  onBlur={handleAgeBlur}
                  type="button"
                  className={`h-11 py-3 px-4 w-[150px] overflow-y-auto appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm font-semibold ${
                    ageFocus ? "border-peach-fuzz" : "border-gray-400"
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

            {/* 이메일 */}
            <Input
              label="이메일"
              width="320px"
              name="email"
              value={userData.email}
              readOnly={true}
            />

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
            <Input
              label="세부주소"
              width="320px"
              name="detailAddress"
              value={userData.detailAddress}
              onChange={handleUserDataChange}
              required={true}
            />
          </div>
          {isExpanded && (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="flex flex-row space-x-6 relative items-center justify-between">
                {/* 상품 */}
                <div className="dropdown relative">
                  <button
                    onClick={onClickPeriod}
                    className="w-[120px] flex justify-between items-center border border-gray-400 rounded-lg p-2 "
                  >
                    {selectedPeriod}
                    <BsChevronDown />
                  </button>
                  {isDropdownOpen && (
                    <ul className="absolute w-full border border-gray-400 rounded-lg list-none z-10 bg-white">
                      {period.map((item) => (
                        <li
                          key={item.id}
                          className="px-2 py-1 rounded-md hover:bg-grayish-red hover:bg-opacity-30"
                        >
                          <button value={item.name} onClick={onClickPeriod}>
                            {item.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="relative">
                  <CustomDatePicker
                    selectedDate={regDate}
                    setSelectedDate={handleRegDateChange}
                  />
                </div>
                <span>-</span>
                <div className="relative">
                  <CustomDatePicker
                    selectedDate={expDate}
                    setSelectedDate={handleExpDateChange}
                  />
                </div>
              </div>

              {/* 신청사유 */}
              <label
                className={`absolute -top-2 px-2 text-xs pointer-events-none text-gray-400`}
              >
                신청사유
              </label>
              <div className="relative">
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
              {/* 운동경력(선택) */}
              <label
                className={`absolute right-28 -top-2 px-2 text-xs pointer-events-none text-gray-400`}
              >
                운동경력(선택)
              </label>
              <div className="relative">
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
              <div className="flex float-end">
                <div className="mr-2">
                  <Button
                    width="120px"
                    color="peach-fuzz"
                    label="수정"
                    onClick={handleModify}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {!isExpanded && (
          <button onClick={toggleExpand}>
            <FaAngleDoubleRight className=" mx-auto animate-[propel_3s_infinite]" />
          </button>
        )}
        {isExpanded && (
          //임시로 넣어둠 ( 누르면 결제창 이동)
          <button>
            <FaAngleDoubleRight className=" mx-auto animate-[propel_3s_infinite]" />
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
          line1={"헬스장에 등록되었습니다!"}
          button2={{
            label: "확인",
            onClick: handleConfirmClick,
          }}
        />
      )}
    </>
  );
};

export default MemberRegister;
