import React, { useState, useEffect } from "react";
import Input from "../components/shared/Input";
import AddressModal from "../components/modals/AddressModal";
import useValidation from "../hooks/useValidation";
import CustomDatePicker from "../components/shared/DatePicker";
import formatDate from "../components/shared/FormatDate";

import { FaAngleDoubleDown, FaChevronDown, FaChevronUp } from "react-icons/fa";
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

// 상품 횟수
const period = [
    { id: "1M", name: "5회" },
    { id: "2M", name: "10회" },
    { id: "4M", name: "20회" },
    { id: "6M", name: "30회" },
    { id: "12M", name: "40회" }
]

// 트레이너목록 -> 가져와야함 임시로 두명 넣어둠
const TrainerOptions = {
    trainer: ""
}

const PtRegister = () => {
    const [genderFocus, setGenderFocus] = useState(false);
    const [ageFocus, setAgeFocus] = useState(false);
    const [trainerFocus, setTrainerFocus] = useState(false);
    const [timeFocus, setTimeFocus] = useState(false);


    const handleGenderFocus = () => setGenderFocus(true);
    const handleGenderBlur = () => setGenderFocus(false);
    const handleAgeFocus = () => setAgeFocus(true);
    const handleAgeBlur = () => setAgeFocus(false);
    const handleTrainerFocus = () => setTrainerFocus(true);
    const handleTrainerBlur = () => setTrainerFocus(false);
    const handleTimeFocus = () => setTimeFocus(true);
    const handleTimeBlur = () => setTimeFocus(false);


    const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(period[3].name); //선택상품
    const { validateInput } = useValidation();

    const [userData, setUserData] = useState(initUserData);
    const [userGender, setUserGender] = useState("남자"); //성별
    const [userAge, setUserAge] = useState(20); //나이
    const [userTrainer, setUserTrainer] = useState(); //트레이너
    const [selectedTime, setSelectedTime] = useState(); //선택한 PT시간 (PTSession에 StartTime, EndTime)
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

    const handleChangeTrainer = (event) => {
        setUserTrainer(event.target.value);
    };

    const handleChangeTime = (event) => {
        setSelectedTime(event.target.value);
    };

    const ageOptions = [];
    for (let age = 8; age <= 90; age++) {
        ageOptions.push(<option key={age} value={age}>{age}</option>);
    }

    const generateTimeOptions = () => {
        const options = [];
        for (let hour = 0; hour < 24; hour++) {
            const startTime = hour.toString().padStart(2, "0");
            const endTime = ((hour + 1) % 24).toString().padStart(2, "0");
            options.push(<option key={startTime} value={`${startTime}:00 - ${endTime}:00`}>{`${startTime}:00 - ${endTime}:00`}</option>);
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

    const onClickPeriod = (e) => { //상품클릭
        const { value } = e.target;
        setSelectedPeriod(value);
        setDateRange(value);
        toggleDropdown();
    };

    const setDateRange = (selectedPeriodName) => {
        const selectedPeriod = period.find((p) => p.name === selectedPeriodName);
        if (!selectedPeriod) return;

        const monthsToAdd = parseInt(selectedPeriod.id);
        let start = new Date(regDate);

        start.setMonth(start.getMonth() + monthsToAdd);
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
            <div className="flex flex-col items-center relative">
                <GiArchiveRegister className="absolute left-20 w-20 h-20 bg-white"color="#9F8D8D"/>
                <div className="flex flex-row items-center">
                    <div className={`m-10 max-h-[700px] transition-max-height duration-500 overflow-hidden ${isExpanded ? "h-[700px]" : "h-[400px]"} w-[800px] space-x-10 px-20 justify-center rounded-lg flex items-center border-2 border-peach-fuzz`}>
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
                                        onChange={handleUserDataChange}
                                        required={true}
                                    />
                                    {/* 이메일 */}
                                    <Input
                                        label="이메일"
                                        width="320px"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleUserDataChange}
                                        required={true}
                                    />
                                    <div className="flex flex-row items-center space-x-5 ">
                                        {/* 상품 */}
                                        <div className="dropdown relative">
                                            <label className={`absolute -top-4 px-2 text-xs pointer-events-none text-gray-400`}>
                                                횟수
                                            </label>
                                            <button
                                                onClick={toggleDropdown}
                                                isDropdownOpen={isDropdownOpen}
                                                toggleDropdown={toggleDropdown}
                                                selectedPeriod={selectedPeriod}
                                                onClickPeriod={onClickPeriod}
                                                className=" h-11 w-[150px] flex text-sm justify-between items-center border border-gray-400 rounded-lg px-4 py-3">
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

                                        {/* 트레이너 */}
                                        <div className="relative">
                                            <label
                                                className={`absolute w-16 right-27 -top-4 px-2 text-xs pointer-events-none text-gray-400`}
                                            >
                                                트레이너
                                            </label>
                                            <select
                                                onFocus={handleTrainerFocus}
                                                onBlur={handleTrainerBlur}
                                                type="button"
                                                className={`h-11 py-3 px-4 w-[150px] overflow-y-auto appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm  ${trainerFocus ? "border-peach-fuzz" : "border-gray-400"
                                                    } focus:border-2 focus:outline-none text-sm peer `}
                                                value={userTrainer}
                                                onChange={handleChangeTrainer}
                                            >
                                                <option value="남자">김종국</option>
                                                <option value="여자">심이뜸</option>
                                            </select>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                {!trainerFocus ? (
                                                    <FaChevronDown className="text-gray-400" />
                                                ) : (
                                                    <FaChevronUp className="text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row items-center space-x-4">
                                        {/* 시작일 */}
                                        <div className="relative">
                                            <CustomDatePicker

                                                selectedDate={regDate}
                                                setSelectedDate={handleRegDateChange}
                                            />
                                        </div>
                                        <span>-</span>
                                        {/* 만료일 */}
                                        <div className="relative">
                                            <CustomDatePicker
                                                selectedDate={expDate}
                                                setSelectedDate={handleExpDateChange}
                                            />
                                        </div>
                                    </div>
                                    {isExpanded && (

                                        <TextArea
                                            width="320px"
                                            height="200px"
                                            label="신청사유"
                                            required={true}
                                            name="userMemberReason"
                                            value={formValues.userMemberReason}
                                            onChange={handleInputChange} />


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
                                                className={`h-11 py-3 px-4 w-[150px]  appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm ${genderFocus ? "border-peach-fuzz" : "border-gray-400"
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
                                                className={`h-11 py-3 px-4 w-[150px] overflow-y-auto appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm ${ageFocus ? "border-peach-fuzz" : "border-gray-400"
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
                                                className={`h-11 py-3 px-4 w-[150px] overflow-y-auto appearance-none bg-transparent border rounded-lg inline-flex items-center gap-x-2 text-sm ${timeFocus ? "border-peach-fuzz" : "border-gray-400"
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
                                        <TextArea
                                            width="320px"
                                            height="200px"
                                            label="운동경력(선택)"
                                            required={false}
                                            name="userWorkoutDuration"
                                            value={formValues.userWorkoutDuration}
                                            onChange={handleInputChange}
                                        />

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
            {isExpanded && (
                    //임시로 넣어둠 ( 누르면 결제창 이동)
                    <button>
                        <FaAngleDoubleRight className=" mx-auto animate-[propel_3s_infinite]" />
                    </button>
            )}
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

export default PtRegister;