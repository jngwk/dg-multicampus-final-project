import React, { useState, useEffect } from "react";
import { endOfMonth, startOfMonth, getYear, getMonth, getDate } from "date-fns";
import MembershipChart1 from "../components/membership/MembershipChart1";
import MembershipChart2 from "../components/membership/MembershipChart2";
import AdditionalCharts from "../components/membership/AdditionalCharts";
import Button from "../components/shared/Button";
import { GymInfo } from "../api/gymApi";
import { getMembershipStats } from "../api/membershipApi";
import { getPtSession } from "../api/ptApi";
import Fallback from "../components/shared/Fallback";
import AlertModal from "../components/modals/AlertModal";
import { useNavigate } from "react-router-dom";

const MembershipStats = () => {
  const navigate = useNavigate();
  const [filterToggle, setFilterToggle] = useState(false);
  const [stats, setStats] = useState([]);
  const [filterType, setFilterType] = useState("전체");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [gymName, setGymName] = useState("");
  const [ptSessions, setPtSessions] = useState([]);
  const [minPtDate, setMinPtDate] = useState("");
  const [maxPtDate, setMaxPtDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const today = new Date();
  const currentYear = getYear(today).toString();
  const currentMonth = (getMonth(today) + 1).toString();
  const currentWeek = Math.ceil(getDate(today) / 7).toString();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedWeek, setSelectedWeek] = useState(currentWeek);

  const currentMonthStart = startOfMonth(today);
  const currentMonthEnd = endOfMonth(today);
  const [ptStart, setPtStart] = useState(currentMonthStart);
  const [ptEnd, setPtEnd] = useState(currentMonthEnd);

  const [loading, setLoading] = useState(true);
  const [zoomWeek, setZoomWeek] = useState(null);
  const [chartInstance, setChartInstance] = useState(null);
  const [zoomEnabled, setZoomEnabled] = useState(false);
  const [panEnabled, setPanEnabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, ptSessionsData, gymInfoData] = await Promise.all([
          getMembershipStats(),
          getPtSession(),
          GymInfo(1),
        ]);

        if (!statsData || !ptSessionsData || !gymInfoData) {
          throw new Error("데이터를 불러오는 데 실패했습니다.");
        }

        setStats(statsData);
        setPtSessions(
          ptSessionsData.sort(
            (a, b) => new Date(a.workoutDate) - new Date(b.workoutDate)
          )
        );
        setGymName(gymInfoData.gymName);

        if (statsData.length > 0) {
          const minDate = new Date(
            Math.min(...statsData.map((item) => new Date(item.regDate)))
          );
          const maxDate = new Date(
            Math.max(...statsData.map((item) => new Date(item.regDate)))
          );
          setStart(formatDate(minDate));
          setEnd(formatDate(maxDate));
        }

        if (ptSessionsData.length > 0) {
          const earliestDate = new Date(ptSessionsData[0]?.workoutDate);
          const latestDate = new Date(
            ptSessionsData[ptSessionsData.length - 1]?.workoutDate
          );
          setMinPtDate(formatDate(earliestDate));
          setMaxPtDate(formatDate(latestDate));
        }

        if (
          (!statsData || statsData.length === 0) &&
          (!ptSessionsData || ptSessionsData.length === 0)
        ) {
          setModalMessage("수집한 회원 데이터가 부족합니다.");
          setShowModal(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setModalMessage("데이터를 불러오는데 문제가 발생했습니다.");
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const setChartRef = (ref) => {
    if (ref) {
      setChartInstance(ref);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleResetFilters = () => {
    setFilterType("전체");
    setStart(
      formatDate(
        new Date(Math.min(...stats.map((item) => new Date(item.regDate))))
      )
    );
    setEnd(
      formatDate(
        new Date(Math.max(...stats.map((item) => new Date(item.regDate))))
      )
    );
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedWeek(currentWeek);
    setPtStart(currentMonthStart);
    setPtEnd(currentMonthEnd);
    setZoomWeek(null);
  };

  const getUniqueYears = () => {
    const years = ptSessions.map((session) =>
      new Date(session.workoutDate).getFullYear()
    );
    return Array.from(new Set(years)).sort((a, b) => a - b);
  };

  const getMonthOptions = () => {
    if (selectedYear === "전체") return [];
    const months = new Set();
    ptSessions.forEach((session) => {
      const sessionYear = new Date(session.workoutDate).getFullYear();
      if (sessionYear.toString() === selectedYear) {
        const month = new Date(session.workoutDate).getMonth() + 1;
        months.add(month);
      }
    });
    return Array.from(months).sort((a, b) => a - b);
  };

  const getWeekOptions = () => {
    if (selectedYear === "전체" || selectedMonth === "전체") return [];
    const firstDayOfMonth = new Date(`${selectedYear}-${selectedMonth}-01`);
    const lastDayOfMonth = endOfMonth(
      new Date(selectedYear, selectedMonth - 1)
    );
    const weeksInMonth = Math.ceil(
      (lastDayOfMonth.getDate() -
        firstDayOfMonth.getDate() +
        1 +
        firstDayOfMonth.getDay()) /
        7
    );
    return Array.from({ length: weeksInMonth }, (_, i) => i + 1);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
    setSelectedMonth("전체");
    setSelectedWeek("전체");
    updatePtDateRange(e.target.value, "전체", "전체");
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
    setSelectedWeek("전체");
    updatePtDateRange(selectedYear, e.target.value, "전체");
  };

  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value);
    updatePtDateRange(selectedYear, selectedMonth, e.target.value);
  };

  const updatePtDateRange = (year, month, week) => {
    if (year === "전체") {
      setPtStart(minPtDate);
      setPtEnd(maxPtDate);
      setZoomWeek(null);
    } else {
      let start = new Date(year, month === "전체" ? 0 : month - 1, 1);
      let end =
        month === "전체"
          ? new Date(year, 11, 31)
          : endOfMonth(new Date(year, month - 1));

      if (week !== "전체") {
        start.setDate((week - 1) * 7 + 1);
        end = new Date(start);
        end.setDate(start.getDate() + 6);
      }

      setPtStart(formatDate(start));
      setPtEnd(formatDate(end));
      setZoomWeek(
        week !== "전체"
          ? { start: formatDate(start), end: formatDate(end) }
          : null
      );
    }
  };

  const toggleZoom = () => {
    setZoomEnabled((prev) => !prev);
    if (chartInstance) {
      chartInstance.options.plugins.zoom.zoom.wheel.enabled = !zoomEnabled;
      chartInstance.options.plugins.zoom.pan.enabled = panEnabled;
      chartInstance.update("none");
    }
  };

  const togglePan = () => {
    setPanEnabled((prev) => !prev);
    if (chartInstance) {
      chartInstance.options.plugins.zoom.pan.enabled = !panEnabled;
      chartInstance.options.plugins.zoom.zoom.wheel.enabled = zoomEnabled;
      chartInstance.update("none");
    }
  };

  const resetZoom = () => {
    setZoomWeek(null);
    setPtStart(currentMonthStart);
    setPtEnd(currentMonthEnd);
    setSelectedYear(currentYear);
    setSelectedMonth(currentMonth);
    setSelectedWeek(currentWeek);
    if (chartInstance) {
      chartInstance.resetZoom();
    }
  };

  const handleZoomToNextWeek = () => {
    let newStart, newEnd;

    if (zoomWeek) {
      newStart = new Date(zoomWeek.start);
      newStart.setDate(newStart.getDate() + 7);
    } else {
      newStart = new Date(minPtDate);
    }
    newEnd = new Date(newStart);
    newEnd.setDate(newStart.getDate() + 6);

    if (newEnd > new Date(maxPtDate)) {
      resetZoom();
    } else {
      setZoomWeek({ start: formatDate(newStart), end: formatDate(newEnd) });
      setPtStart(formatDate(newStart));
      setPtEnd(formatDate(newEnd));

      const newYear = newStart.getFullYear().toString();
      const newMonth = (newStart.getMonth() + 1).toString();
      const newWeek = Math.ceil(
        (newStart.getDate() + newStart.getDay()) / 7
      ).toString();

      setSelectedYear(newYear);
      setSelectedMonth(newMonth);
      setSelectedWeek(newWeek);
    }
  };

  const handleZoomToPreviousWeek = () => {
    let newStart, newEnd;

    if (zoomWeek) {
      newStart = new Date(zoomWeek.start);
      newStart.setDate(newStart.getDate() - 7);
    } else {
      newStart = new Date(maxPtDate);
      newStart.setDate(newStart.getDate() - 7);
    }
    newEnd = new Date(newStart);
    newEnd.setDate(newStart.getDate() + 6);

    if (newStart < new Date(minPtDate)) {
      resetZoom();
    } else {
      setZoomWeek({ start: formatDate(newStart), end: formatDate(newEnd) });
      setPtStart(formatDate(newStart));
      setPtEnd(formatDate(newEnd));

      const newYear = newStart.getFullYear().toString();
      const newMonth = (newStart.getMonth() + 1).toString();
      const newWeek = Math.ceil(
        (newStart.getDate() + newStart.getDay()) / 7
      ).toString();

      setSelectedYear(newYear);
      setSelectedMonth(newMonth);
      setSelectedWeek(newWeek);
    }
  };

  const getPreferredDay = () => {
    const dayCounts = ptSessions.reduce((acc, session) => {
      const dayOfWeek = new Date(session.workoutDate).getDay();
      acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
      return acc;
    }, {});

    const preferredDayIndex = Object.keys(dayCounts).reduce((a, b) =>
      dayCounts[a] > dayCounts[b] ? a : b
    );

    const daysOfWeek = [
      "일요일",
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
    ];
    return daysOfWeek[preferredDayIndex];
  };

  const getPreferredTime = () => {
    const timeCounts = ptSessions.reduce((acc, session) => {
      const time = session.startTime.split(":")[0];
      acc[time] = (acc[time] || 0) + 1;
      return acc;
    }, {});

    const preferredTime = Object.keys(timeCounts).reduce((a, b) =>
      timeCounts[a] > timeCounts[b] ? a : b
    );

    return `${preferredTime}시`;
  };

  if (loading) {
    return <Fallback />;
  }

  if (showModal) {
    return (
      <AlertModal
        headerEmoji="⚠️"
        line1={modalMessage}
        button2={{
          label: "확인",
          onClick: () => navigate(-1),
        }}
      />
    );
  } else {
    return (
      <div className="flex flex-col bg-[#f7f5f2]">
        <div className="bg-[#f7f5f2] p-4 shadow">
          <h1 className="text-2xl font-bold">{gymName}</h1>
        </div>

        <div className="flex-1">
          <div className="p-6">
            <div className="bg-white p-4 mb-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">필터</h3>
                <button
                  onClick={() => setFilterToggle((prev) => !prev)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                  aria-label={filterToggle ? "필터 숨기기" : "필터 보이기"}
                >
                  <span className="text-xl">{filterToggle ? "▲" : "▼"}</span>
                </button>
              </div>
              {filterToggle && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      헬스장 등록 차트
                    </h3>
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
                        onChange={(e) => setStart(e.target.value + "-01")}
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
                    <button
                      onClick={handleResetFilters}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      필터 리셋
                    </button>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      PT 선호도 차트
                    </h3>
                    <label className="block mb-2">
                      <span className="text-gray-700">연도:</span>
                      <select
                        value={selectedYear}
                        onChange={handleYearChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                      >
                        <option value="전체">전체</option>
                        {getUniqueYears().map((year) => (
                          <option key={year} value={year}>
                            {year}년
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block mb-2">
                      <span className="text-gray-700">월:</span>
                      <select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        disabled={selectedYear === "전체"}
                      >
                        <option value="전체">전체</option>
                        {getMonthOptions().map((month) => (
                          <option key={month} value={month}>
                            {month}월
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block mb-2">
                      <span className="text-gray-700">주:</span>
                      <select
                        value={selectedWeek}
                        onChange={handleWeekChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        disabled={
                          selectedYear === "전체" || selectedMonth === "전체"
                        }
                      >
                        <option value="전체">전체</option>
                        {getWeekOptions().map((week) => (
                          <option key={week} value={week}>
                            {week}주차
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="flex justify-end mt-2 gap-2">
                      <button
                        onClick={toggleZoom}
                        className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          zoomEnabled
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200 focus:ring-blue-500"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500"
                        }`}
                      >
                        {zoomEnabled ? "확대 활성화" : "확대 비활성화"}
                      </button>
                      <button
                        onClick={togglePan}
                        className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          panEnabled
                            ? "bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500"
                        }`}
                      >
                        {panEnabled ? "드래그 활성화" : "드래그 비활성화"}
                      </button>
                      <button
                        onClick={resetZoom}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        줌 초기화
                      </button>
                      <button
                        onClick={handleZoomToPreviousWeek}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        저번 주
                      </button>
                      <button
                        onClick={handleZoomToNextWeek}
                        className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                      >
                        다음 주
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 mt-2">
                      <p>선호 요일: {getPreferredDay()}</p>
                      <p>선호 시간대: {getPreferredTime()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Charts */}
          <div className="chart-container relative grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <MembershipChart1
              stats={stats}
              filterType={filterType}
              start={start}
              end={end}
            />
            <MembershipChart2
              ptSessions={ptSessions}
              ptStart={zoomWeek ? zoomWeek.start : ptStart}
              ptEnd={zoomWeek ? zoomWeek.end : ptEnd}
              onZoomToNextWeek={handleZoomToNextWeek}
              onZoomToPreviousWeek={handleZoomToPreviousWeek}
              isZoomEnabled={zoomEnabled}
              isPanEnabled={panEnabled}
              toggleZoom={toggleZoom}
              togglePan={togglePan}
              resetZoom={resetZoom}
              setChartRef={setChartRef}
            />
          </div>
          <div className="mb-6">
            <AdditionalCharts stats={stats} />
          </div>
        </div>
      </div>
    );
  }
};

export default MembershipStats;
