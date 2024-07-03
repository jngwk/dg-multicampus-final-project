import React, { useState, useEffect } from 'react';
import { endOfMonth } from 'date-fns';
import MembershipChart1 from '../components/membership/MembershipChart1';
import MembershipChart2 from '../components/membership/MembershipChart2';
import MembershipTable from '../components/membership/Membership';
import Button from '../components/shared/Button'; // Button 컴포넌트 import 추가
import { GymInfo } from '../api/gymApi';
import { getMembershipStats } from '../api/membershipApi';
import { getPtSession } from '../api/ptApi';


const tempData = [
  {
    regDate: "2023-01-15",
    expDate: "2024-01-14",
    userMemberReason: "건강 유지",
    userGender: "남성",
    userAge: 30,
    userWorkoutDuration: "2년"
  },
  {
    regDate: "2023-03-20",
    expDate: "2024-03-19",
    userMemberReason: "다이어트",
    userGender: "여성",
    userAge: 25,
    userWorkoutDuration: "1년"
  },
  {
    regDate: "2023-03-20",
    expDate: "2024-03-19",
    userMemberReason: "다이어트",
    userGender: "여성",
    userAge: 25,
    userWorkoutDuration: "1년"
  },
  {
    regDate: "2023-03-20",
    expDate: "2024-03-19",
    userMemberReason: "다이어트",
    userGender: "여성",
    userAge: 25,
    userWorkoutDuration: "1년"
  },
  {
    regDate: "2023-03-20",
    expDate: "2024-03-19",
    userMemberReason: "다이어트",
    userGender: "여성",
    userAge: 25,
    userWorkoutDuration: "1년"
  },
  {
    regDate: "2023-03-20",
    expDate: "2024-03-19",
    userMemberReason: "다이어트",
    userGender: "여성",
    userAge: 25,
    userWorkoutDuration: "1년"
  },
  {
    regDate: "2023-03-20",
    expDate: "2024-03-19",
    userMemberReason: "다이어트",
    userGender: "여성",
    userAge: 25,
    userWorkoutDuration: "1년"
  },
  {
    regDate: "2023-03-20",
    expDate: "2024-03-19",
    userMemberReason: "다이어트",
    userGender: "여성",
    userAge: 25,
    userWorkoutDuration: "1년"
  },
  {
    regDate: "2023-03-20",
    expDate: "2024-03-19",
    userMemberReason: "다이어트",
    userGender: "여성",
    userAge: 25,
    userWorkoutDuration: "1년"
  },
  {
    regDate: "2023-03-20",
    expDate: "2024-03-19",
    userMemberReason: "다이어트",
    userGender: "여성",
    userAge: 25,
    userWorkoutDuration: "1년"
  },
  {
    regDate: "2023-03-20",
    expDate: "2024-03-19",
    userMemberReason: "다이어트",
    userGender: "여성",
    userAge: 25,
    userWorkoutDuration: "1년"
  },

  // 추가적인 임시 데이터도 필요에 따라 추가할 수 있습니다.
];


const MembershipStats = () => {
  // 필터 사이드바
  const [FilterToggle, setFilterToggle] = useState(false);

  // 헬스장 등록 차트
  const [stats, setStats] = useState([]);
  const [filterType, setFilterType] = useState('전체');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [gymName, setGymName] = useState('');

  // PT 선호도 차트
  const [ptSessions, setPtSessions] = useState([]);
  const [minPtDate, setMinPtDate] = useState('');
  const [maxPtDate, setMaxPtDate] = useState('');
  const [selectedYear, setSelectedYear] = useState('전체');
  const [selectedMonth, setSelectedMonth] = useState('전체');
  const [selectedWeek, setSelectedWeek] = useState('전체'); // New state for week filter
  const [ptStart, setPtStart] = useState('');
  const [ptEnd, setPtEnd] = useState('');

  useEffect(() => {
    // 회원 가입 통계 데이터를 가져오는 함수
    const fetchStats = async () => {
      try {
        const data = await getMembershipStats();
        setStats(data);

        // 데이터가 존재할 경우 최소 및 최대 날짜 설정
        if (data.length > 0) {
          const minDate = new Date(Math.min(...data.map(item => new Date(item.regDate))));
          const maxDate = new Date(Math.max(...data.map(item => new Date(item.regDate))));
          setStart(formatDate(minDate));
          setEnd(formatDate(maxDate));
        }

        // 헬스장 정보 가져오기
        const gymInfo = await GymInfo(1);
        setGymName(gymInfo.gymName);
      } catch (error) {
        console.error("Error fetching stats data:", error);
      }
    };

    // PT 세션 데이터를 가져오는 함수
    const fetchPtSessions = async () => {
      try {
        const sessions = await getPtSession();
        sessions.sort((a, b) => new Date(a.workoutDate) - new Date(b.workoutDate));

        if (sessions.length > 0) {
          const earliestDate = new Date(sessions[0]?.workoutDate);
          const latestDate = new Date(sessions[sessions.length - 1]?.workoutDate);
          setPtSessions(sessions);
          setMinPtDate(formatDate(earliestDate));
          setMaxPtDate(formatDate(latestDate));
          setPtStart(formatDate(earliestDate));
          setPtEnd(formatDate(latestDate));
        }
      } catch (error) {
        console.error('Error fetching PT sessions:', error);
      }
    };

    fetchStats();
    fetchPtSessions();
  }, []);

  // 날짜를 'yyyy-MM-dd' 형식으로 변환하는 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to get unique years from ptSessions
  const getUniqueYears = () => {
    const years = ptSessions.map(session => new Date(session.workoutDate).getFullYear());
    return Array.from(new Set(years));
  };

  // Function to generate year options
  const getYearOptions = () => {
    const uniqueYears = getUniqueYears();
    return uniqueYears.map(year => (
      <option key={year} value={year}>
        {year}년
      </option>
    ));
  };

  // Function to generate month options based on selected year
  const getMonthOptions = () => {
    if (selectedYear === '전체') {
      return (
        <option value="전체">월 전체</option>
      );
    }

    const months = new Set();
    ptSessions.forEach(session => {
      const sessionYear = new Date(session.workoutDate).getFullYear();
      if (sessionYear.toString() === selectedYear) {
        const month = new Date(session.workoutDate).getMonth() + 1;
        months.add(month);
      }
    });

    return Array.from(months).map(month => (
      <option key={month} value={month}>
        {month}월
      </option>
    ));
  };

  // Function to generate week options
  const getWeekOptions = () => {
    if (selectedYear === '전체' || selectedMonth === '전체') {
      return (
        <option value="전체">주 전체</option>
      );
    }

    const firstDayOfMonth = new Date(`${selectedYear}-${selectedMonth}-01`);
    const lastDayOfMonth = new Date(selectedYear, selectedMonth, 0);
    const weeksInMonth = Math.ceil((lastDayOfMonth.getDate() - firstDayOfMonth.getDate() + 1 + firstDayOfMonth.getDay()) / 7);

    return Array.from({ length: weeksInMonth }, (_, index) => {
      const startDate = new Date(firstDayOfMonth);
      startDate.setDate(startDate.getDate() + index * 7);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
      const startDay = String(startDate.getDate()).padStart(2, '0');
      const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
      const endDay = String(endDate.getDate()).padStart(2, '0');

      return (
        <option key={index} value={`${startMonth}-${startDay} ~ ${endMonth}-${endDay}`}>
          {`${startMonth}-${startDay} ~ ${endMonth}-${endDay}`}
        </option>
      );
    });
  };

  // Function to handle year change
  const handleYearChange = (event) => {
    const selectedYear = event.target.value;
    setSelectedYear(selectedYear);
    setSelectedMonth('전체');
    setSelectedWeek('전체'); // Reset week filter when year changes
  };

  // Function to handle month change
  const handleMonthChange = (event) => {
    const selectedMonth = event.target.value;
    setSelectedMonth(selectedMonth);
    setSelectedWeek('전체'); // Reset week filter when month changes
  };

  // Function to handle week change
  const handleWeekChange = (event) => {
    const selectedWeek = event.target.value;
    setSelectedWeek(selectedWeek);
  };

  // Function to get week number for a given date
  const getWeekNumber = (date) => {
    const onejan = new Date(date.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(((date - onejan) / 86400000 + onejan.getDay() + 1) / 7);
    return weekNumber;
  };


  // Function to get PT session range based on selected year, month, and week
  const filterPtSessionsByYearMonthAndWeek = () => {
    if (selectedYear === '전체' && selectedMonth === '전체' && selectedWeek === '전체') {
      setPtStart(minPtDate);
      setPtEnd(maxPtDate);
      return;
    }

    const filteredSessions = ptSessions.filter(session => {
      const sessionYear = new Date(session.workoutDate).getFullYear().toString();
      const sessionMonth = (new Date(session.workoutDate).getMonth() + 1).toString();
      const sessionWeek = getWeekNumber(new Date(session.workoutDate)); // Using getWeekNumber function
      return (selectedYear === '전체' || sessionYear === selectedYear) &&
        (selectedMonth === '전체' || sessionMonth === selectedMonth) &&
        (selectedWeek === '전체' || sessionWeek === parseInt(selectedWeek.replace('주차', ''), 10)); // Converting selectedWeek to number
    });

    if (filteredSessions.length > 0) {
      const earliestDate = new Date(filteredSessions[0].workoutDate);
      const latestDate = new Date(filteredSessions[filteredSessions.length - 1].workoutDate);
      setPtStart(formatDate(earliestDate));
      setPtEnd(formatDate(latestDate));
    } else {
      // If no sessions match the filter, set the start and end to empty
      setPtStart('');
      setPtEnd('');
    }
  };

  // useEffect to filter PT sessions when selectedYear, selectedMonth, or selectedWeek changes
  useEffect(() => {
    filterPtSessionsByYearMonthAndWeek();
  }, [selectedYear, selectedMonth, selectedWeek]);

  // Reset filters
  const handleResetFilters = () => {
    setFilterType('전체');
    const minDate = new Date(Math.min(...stats.map(item => new Date(item.regDate))));
    const maxDate = new Date(Math.max(...stats.map(item => new Date(item.regDate))));
    setStart(formatDate(minDate));
    setEnd(formatDate(maxDate));
    setSelectedYear('전체');
    setSelectedMonth('전체');
    setSelectedWeek('전체'); // Reset week filter
    setPtStart(minPtDate); // Reset PT session filters
    setPtEnd(maxPtDate);
  };

  return (
    <>
      <div className={`${FilterToggle? "space-x-3 " : " " } flex h-screen overflow-hidden`}>
        <div className="bg-gray-200 w-3/7 max-h-full h-7/8 border-r scrollbar-hide rounded-r-lg overflow-y-auto my-2 ">
          <div className={` ${FilterToggle? "hidden md:block " : "hidden" } `}>
            {/* Filter Search Section */}
            <div className="p-4">
              <h2 className="text-base font-semibold mb-4">필터 검색</h2>
              <label className="block mb-2">
                <h2 className="text-base font-normal mb-4">헬스장 등록 차트</h2>
                <p className="text-sm">필터 조건 :</p>
                <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 border rounded-md mb-2">
                  <option value="전체">전체</option>
                  <option value="남성">남성</option>
                  <option value="여성">여성</option>
                </select>
              </label>
              <label className="block mb-2 text-sm">
                시작 날짜 :
                <input
                  type="month"
                  value={start.slice(0, 7)}
                  onChange={e => setStart(e.target.value)}
                  min={start.slice(0, 7)} // 최소 날짜 설정
                  max={end.slice(0, 7)} // 최대 날짜 설정
                  className="px-3 py-2 border rounded-md"
                />
              </label>
              <label className="block mb-2 text-sm">
                종료 날짜 :
                <input
                  type="month"
                  value={end.slice(0, 7)}
                  min={start.slice(0, 7)} // 최소 날짜 설정
                  max={end.slice(0, 7)} // 최대 날짜 설정
                  onChange={(e) => {
                    const selectedMonth = e.target.value;
                    const year = selectedMonth.slice(0, 4);
                    const month = selectedMonth.slice(5, 7);
                    const lastDayOfMonth = endOfMonth(new Date(year, month - 1)).toISOString().slice(0, 10);
                    setEnd(lastDayOfMonth);
                  }}
                  className="px-3 py-2 border rounded-md"
                />
              </label>
              <Button label="리셋" onClick={handleResetFilters} width='130px' />
            </div>

            {/* PT 선호도 차트 Filter Section */}
            <div className="p-4 mt-8">
              <h2 className="text-base font-normal mb-4">PT 선호도 차트</h2>
              <label className="block mb-2 text-sm">
                연도 필터 :
                <select value={selectedYear} onChange={handleYearChange} className="px-3 py-2 border rounded-md mb-2">
                  <option value="전체">연도 전체</option>
                  {getYearOptions()}
                </select>
              </label>
              <label className="block mb-2 text-sm">
                월 필터 :
                <select value={selectedMonth} onChange={handleMonthChange} className="px-3 py-2 border rounded-md mb-2">
                  <option value="전체">월 전체</option>
                  {getMonthOptions()}
                </select>
              </label>
              <label className="block mb-2 text-sm">
                주 필터 :
                <select value={selectedWeek} onChange={handleWeekChange} className="px-3 py-2 border rounded-md mb-2">
                  {getWeekOptions()}
                </select>
              </label>
              <Button label="리셋" onClick={handleResetFilters} width='130px' /> {/* PT 선호도 차트 섹션에 추가한 리셋 버튼 */}
            </div>
          </div>
        </div>



        {/* Main Content */}
        <div className="flex flex-col flex-3 h-full overflow-y-auto scrollbar-hide">
          {/* Page Header */}
          <div className="bg-gray-100 p-4 border-b flex flex-row items-center py-2 m-2 rounded-lg ">
            <button
              onClick={() => setFilterToggle(!FilterToggle)}
              className=' text-sm hover:animate-jelly mr-5 border border-gray-100 px-2 py-1 rounded-lg bg-white hover:bg-light-gray'>
              <p>🏴 필터</p>
            </button>
            <div><h2 className="text-base font-normal">{gymName}</h2></div>
          </div>

          
          {/* Membership Chart Section */}
          <div className="flex flex-row items-center px-10 my-8">
            <div className="flex items-center justify-center w-1/2">
              <MembershipChart1 stats={stats} filterType={filterType} start={start} end={end} />
            </div>
            <div className="flex items-center justify-center w-1/2">
              <MembershipChart2
                ptSessions={ptSessions}
                minPtDate={minPtDate}
                maxPtDate={maxPtDate}
                ptStart={ptStart}
                ptEnd={ptEnd}
              />
            </div>
          </div>

          {/* Membership Table Section */}
          <div className="px-4">
            <MembershipTable stats={tempData} filterType={filterType} start={start} end={end} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipStats;
