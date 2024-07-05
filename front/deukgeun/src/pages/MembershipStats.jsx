import React, { useState, useEffect } from 'react';
import { endOfMonth } from 'date-fns';
import MembershipChart1 from '../components/membership/MembershipChart1';
import MembershipChart2 from '../components/membership/MembershipChart2';
import MembershipTable from '../components/membership/Membership';
// import AdditionalCharts from '../components/membership/AdditionalCharts';
import Button from '../components/shared/Button';
import { GymInfo } from '../api/gymApi';
import { getMembershipStats } from '../api/membershipApi';
import { getPtSession } from '../api/ptApi';

const MembershipStats = () => {
  const [filterToggle, setFilterToggle] = useState(false);
  const [stats, setStats] = useState([]);
  const [filterType, setFilterType] = useState('전체');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [gymName, setGymName] = useState('');
  const [ptSessions, setPtSessions] = useState([]);
  const [minPtDate, setMinPtDate] = useState('');
  const [maxPtDate, setMaxPtDate] = useState('');
  const [selectedYear, setSelectedYear] = useState('전체');
  const [selectedMonth, setSelectedMonth] = useState('전체');
  const [selectedWeek, setSelectedWeek] = useState('전체');
  const [ptStart, setPtStart] = useState('');
  const [ptEnd, setPtEnd] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, ptSessionsData, gymInfoData] = await Promise.all([
          getMembershipStats(),
          getPtSession(),
          GymInfo(1)
        ]);

        setStats(statsData);
        setPtSessions(ptSessionsData.sort((a, b) => new Date(a.workoutDate) - new Date(b.workoutDate)));
        setGymName(gymInfoData.gymName);

        if (statsData.length > 0) {
          const minDate = new Date(Math.min(...statsData.map(item => new Date(item.regDate))));
          const maxDate = new Date(Math.max(...statsData.map(item => new Date(item.regDate))));
          setStart(formatDate(minDate));
          setEnd(formatDate(maxDate));
        }

        if (ptSessionsData.length > 0) {
          const earliestDate = new Date(ptSessionsData[0]?.workoutDate);
          const latestDate = new Date(ptSessionsData[ptSessionsData.length - 1]?.workoutDate);
          setMinPtDate(formatDate(earliestDate));
          setMaxPtDate(formatDate(latestDate));
          setPtStart(formatDate(earliestDate));
          setPtEnd(formatDate(latestDate));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleResetFilters = () => {
    setFilterType('전체');
    setStart(formatDate(new Date(Math.min(...stats.map(item => new Date(item.regDate))))));
    setEnd(formatDate(new Date(Math.max(...stats.map(item => new Date(item.regDate))))));
    setSelectedYear('전체');
    setSelectedMonth('전체');
    setSelectedWeek('전체');
    setPtStart(minPtDate);
    setPtEnd(maxPtDate);
  };

  const getUniqueYears = () => {
    const years = ptSessions.map(session => new Date(session.workoutDate).getFullYear());
    return Array.from(new Set(years)).sort((a, b) => b - a);
  };

  const getMonthOptions = () => {
    if (selectedYear === '전체') return [];
    const months = new Set();
    ptSessions.forEach(session => {
      const sessionYear = new Date(session.workoutDate).getFullYear();
      if (sessionYear.toString() === selectedYear) {
        const month = new Date(session.workoutDate).getMonth() + 1;
        months.add(month);
      }
    });
    return Array.from(months).sort((a, b) => a - b);
  };

  const getWeekOptions = () => {
    if (selectedYear === '전체' || selectedMonth === '전체') return [];
    const firstDayOfMonth = new Date(`${selectedYear}-${selectedMonth}-01`);
    const lastDayOfMonth = endOfMonth(new Date(selectedYear, selectedMonth - 1));
    const weeksInMonth = Math.ceil((lastDayOfMonth.getDate() - firstDayOfMonth.getDate() + 1 + firstDayOfMonth.getDay()) / 7);
    return Array.from({ length: weeksInMonth }, (_, i) => i + 1);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth('전체');
    setSelectedWeek('전체');
    updatePtDateRange(e.target.value, '전체', '전체');
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSelectedWeek('전체');
    updatePtDateRange(selectedYear, e.target.value, '전체');
  };

  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value);
    updatePtDateRange(selectedYear, selectedMonth, e.target.value);
  };

  const updatePtDateRange = (year, month, week) => {
    if (year === '전체') {
      setPtStart(minPtDate);
      setPtEnd(maxPtDate);
    } else {
      let start = new Date(year, month === '전체' ? 0 : month - 1, 1);
      let end = month === '전체' 
        ? new Date(year, 11, 31) 
        : endOfMonth(new Date(year, month - 1));
      
      if (week !== '전체') {
        start.setDate((week - 1) * 7 + 1);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
      }

      setPtStart(formatDate(start));
      setPtEnd(formatDate(end));
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Filter Sidebar */}
      <div className={`bg-white w-64 p-6 transition-all duration-300 ease-in-out ${filterToggle ? 'translate-x-0' : '-translate-x-full'}`}>
        <h2 className="text-xl font-bold mb-6">필터 검색</h2>
        
        {/* 헬스장 등록 차트 필터 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">헬스장 등록 차트</h3>
          <label className="block mb-2">
            <span className="text-gray-700">필터 조건:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="전체">전체</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </select>
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">시작 날짜:</span>
            <input
              type="month"
              value={start.slice(0, 7)}
              onChange={(e) => setStart(e.target.value + '-01')}
              min={start.slice(0, 7)}
              max={end.slice(0, 7)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">종료 날짜:</span>
            <input
              type="month"
              value={end.slice(0, 7)}
              onChange={(e) => {
                const lastDay = endOfMonth(new Date(e.target.value));
                setEnd(formatDate(lastDay));
              }}
              min={start.slice(0, 7)}
              max={end.slice(0, 7)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </label>
        </div>

        {/* PT 선호도 차트 필터 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">PT 선호도 차트</h3>
          <label className="block mb-2">
            <span className="text-gray-700">연도:</span>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="전체">전체</option>
              {getUniqueYears().map(year => (
                <option key={year} value={year}>{year}년</option>
              ))}
            </select>
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">월:</span>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={selectedYear === '전체'}
            >
              <option value="전체">전체</option>
              {getMonthOptions().map(month => (
                <option key={month} value={month}>{month}월</option>
              ))}
            </select>
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">주:</span>
            <select
              value={selectedWeek}
              onChange={handleWeekChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              disabled={selectedYear === '전체' || selectedMonth === '전체'}
            >
              <option value="전체">전체</option>
              {getWeekOptions().map(week => (
                <option key={week} value={week}>{week}주차</option>
              ))}
            </select>
          </label>
        </div>

        <Button label="필터 리셋" onClick={handleResetFilters} className="w-full" />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{gymName}</h1>
            <Button 
              label={filterToggle ? "필터 숨기기" : "필터 보기"}
              onClick={() => setFilterToggle(!filterToggle)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <MembershipChart1 stats={stats} filterType={filterType} start={start} end={end} />
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <MembershipChart2 ptSessions={ptSessions} ptStart={ptStart} ptEnd={ptEnd} />
            </div>
          </div>
          {/* <div className="mb-6">
            <AdditionalCharts stats={stats} />
          </div> */}

          <div className="bg-white p-4 rounded-lg shadow">
            <MembershipTable stats={stats} filterType={filterType} start={start} end={end} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipStats;