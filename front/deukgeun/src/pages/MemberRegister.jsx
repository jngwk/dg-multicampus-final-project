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
import TextArea from "../components/shared/TextArea";

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
}

// 상품 기간
const period = [
    { id: "ALL", name: "전체" },
    { id: "1W", name: "1주일" },
    { id: "1M", name: "1개월" },
    { id: "3M", name: "3개월" },
    { id: "6M", name: "6개월" }
]

const MemberRegister = () => {
    const [genderFocus, setGenderFocus] = useState(false);
    const [ageFocus, setAgeFocus] = useState(false);


    const handleGenderFocus = () => setGenderFocus(true);
    const handleGenderBlur = () => setGenderFocus(false);
    const handleAgeFocus = () => setAgeFocus(true);
    const handleAgeBlur = () => setAgeFocus(false);


    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(period[3].name); //선택상품
    const { validateInput } = useValidation();

    const [userData, setUserData] = useState(initUserData);
    const [userGender, setUserGender] = useState("남자"); //성별
    const [userAge, setUserAge] = useState(20); //나이
    const [regDate, setRegDate] = useState(new Date()); //시작일
    const [expDate, setExpDate] = useState(new Date()); //만료일


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

    const ageOptions = [];
    for (let age = 8; age <= 90; age++) {
        ageOptions.push(<option key={age} value={age}>{age}</option>);
    }

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const onClickPeriod = (e) => { //상품클릭
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


    const [formValues, setFormValues] = useState(initState);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    //시작일변경
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

    //만료일변경
    const handleExpDateChange = (date) => {
        setExpDate(date);
    };

    return (
        <>

            <div className="flex flex-row items-center relative">
            <GiArchiveRegister className="absolute left-20 top-3 w-20 h-20 bg-white" color="#9F8D8D"/>
                <div className={`m-10 max-w-[1000px] transition-max-width duration-500 overflow-hidden ${isExpanded ? "w-[1000px] justify-between space-x-10 px-20" : "w-[500px] justify-center"} h-[550px] rounded-lg flex items-center border-2 border-peach-fuzz`}>
                    <div className="flex flex-col items-center space-y-6">
                        <p className="font-semibold text-xl">헬스권 등록</p>
                        {/* 이름 */}
                        <Input
                            label="이름"
                            width="320px"
                            name="userName"
                            value={userData.userName}
                            onChange={handleUserDataChange}
                            required={true}
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
                                    className={`h-11 py-3 px-4 w-[150px] appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm  ${genderFocus ? "border-peach-fuzz" : "border-gray-400"
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
                                    className={`h-11 py-3 px-4 w-[150px] overflow-y-auto appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm  ${ageFocus ? "border-peach-fuzz" : "border-gray-400"
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
                            onChange={handleUserDataChange}
                            required={true}
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
                            <div className="flex flex-row space-x-3 relative items-center justify-between">
                                {/* 상품 */}
                                <div className="dropdown relative">
                                    <button
                                        onClick={toggleDropdown}
                                        isDropdownOpen={isDropdownOpen}
                                        toggleDropdown={toggleDropdown}
                                        selectedPeriod={selectedPeriod}
                                        onClickPeriod={onClickPeriod}
                                        className="h-11 w-[130px] flex justify-between items-center border border-gray-400 rounded-lg p-2">
                                        {selectedPeriod}
                                        <BsChevronDown />
                                    </button>
                                    {isDropdownOpen && (
                                        <ul className="absolute w-full border border-gray-400 rounded-lg list-none z-10 bg-white">
                                            {period.map((item) => (
                                                <li key={item.id} className="px-2 py-1 rounded-md hover:bg-grayish-red hover:bg-opacity-30">
                                                    <button value={item.name} onClick={onClickPeriod}>
                                                        {item.name}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                {/* 시작일 */}
                                {/* <label
                                    className={`absolute left-1 -top-2 px-2 text-xs pointer-events-none text-gray-400`}
                                >
                                    시작일
                                </label>
                                <div className="relative">
                                    <CustomDatePicker
                                        onFocus={handleRegDateFocus}
                                        onBlur={handleRegDateBlur}
                                        selectedDate={regDate}
                                        setSelectedDate={setRegDate}
                                    />
                                </div> */}
                                {/* <Input
                                    label="시작일"
                                    type="date"
                                    width="140px"
                                    selectedDate = {regDate}
                                    setSelectedPeriod = {setRegDate}
                                    selectedPeriod = {selectedPeriod}
                                >
                                </Input> */}
                                <div className="relative">
                                    <CustomDatePicker
                                        selectedDate={regDate}
                                        setSelectedDate={handleRegDateChange}
                                    />
                                </div>
                                <span>-</span>
                                {/* 만료일 */}
                                {/*<label
                                    className={`absolute right-16 -top-2 px-2 text-xs pointer-events-none text-gray-400`}
                                >
                                    만료일
                                </label>
                                <div className="relative flex">
                                    <CustomDatePicker
                                        onFocus={handleExpDateFocus}
                                        onBlur={handleExpDateBlur}
                                        selectedDate={expDate}
                                        setSelectedDate={setExpDate}
                                    />
                                </div>*/}
                                {/* <Input
                                    label="만료일"
                                    type="date"
                                    width="140px"
                                    selectedDate = {expDate}
                                    setSelectedPeriod = {setExpDate}
                                    selectedPeriod = {selectedPeriod}>
                                </Input> */}
                                <div className="relative">
                                    <CustomDatePicker
                                        selectedDate={expDate}
                                        setSelectedDate={handleExpDateChange}
                                    />
                                </div>
                            </div>

                            <TextArea width="450px" height="200px"
                                label="신청사유"
                                required={true}
                                name="userMemberReason"
                                value={formValues.userMemberReason}
                                onChange={handleInputChange} />

                            <TextArea width="450px" height="200px"
                                label="운동경력(선택)"
                                required={false}
                                name="userMemberReason"
                                value={formValues.userMemberReason}
                                onChange={handleInputChange} />
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
        </>
    );
};

export default MemberRegister;
