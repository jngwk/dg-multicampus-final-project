import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { getMembershipStats } from '../../api/membershipApi'; // API 호출 추가

// Chart.js 요소 등록
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const MembershipChart1 = ({ filterType, start, end }) => {
  // 상태 정의
  const [selectedMonthData, setSelectedMonthData] = useState(null); // 선택된 월의 데이터 상태
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태
  const [stats, setStats] = useState([]); // 전체 회원 통계 상태

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await getMembershipStats(); // API 호출
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching membership stats:', error);
      }
    };

    fetchData();
  }, []); // 처음 한 번만 호출하도록 []

  // 회원 가입 등록일 기준으로 회원 수를 카운트하는 함수
  const countMembershipByRegDate = (memberships, filter, startDate, endDate) => {
    const counts = {};
    memberships.forEach(membership => {
      const regDate = new Date(membership.regDate);
      const year = regDate.getFullYear();
      const month = regDate.getMonth() + 1;
      const combinedDate = `${year}-${month}`;

      // 선택된 날짜 범위 내의 데이터인지 확인
      const isInRange =
        (!startDate || regDate >= new Date(startDate)) &&
        (!endDate || regDate <= new Date(endDate));

      // 필터 옵션에 따라 데이터를 카운트
      if (isInRange) {
        if (filter === '전체' || membership.userGender === filter) {
          if (!counts[combinedDate]) {
            counts[combinedDate] = [];
          }
          // 날짜가 이미 존재하는지 확인
          const existingDayIndex = counts[combinedDate].findIndex(item => item.day === regDate.getDate());
          if (existingDayIndex !== -1) {
            counts[combinedDate][existingDayIndex].count += 1; // 날짜가 존재하면 카운트 증가
          } else {
            counts[combinedDate].push({ day: regDate.getDate(), count: 1 }); // 새로운 날짜 추가
          }
        }
      }
    });
    return counts;
  };

  // 날짜를 'yyyy-MM' 형식으로 포맷하는 함수
  const formatDate = (date) => {
    const year = String(date.getFullYear()).slice(-2); // 연도의 마지막 두 자리
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}년 ${month}월`;
  };

  // 필터링된 회원 가입 데이터를 기준으로 카운트
  const filteredSignupsCount = countMembershipByRegDate(stats, filterType, start, end);

  // 날짜 순으로 정렬된 배열 생성
  const sortedRegDates = Object.keys(filteredSignupsCount).sort((a, b) => new Date(a) - new Date(b));

  // 클릭한 데이터 포인트의 정보를 보여주는 함수
  const handlePointClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const selectedDate = sortedRegDates[index];
      const selectedMonthDetails = filteredSignupsCount[selectedDate];
      setSelectedMonthData(selectedMonthDetails);
      setSelectedDate(selectedDate);
    }
  };

  // 차트 데이터 설정
  const chartData = {
    labels: sortedRegDates,
    datasets: [
      {
        label: `가입자 수 (${filterType})`,
        data: sortedRegDates.map(date => filteredSignupsCount[date].reduce((acc, curr) => acc + curr.count, 0)),
        borderColor: filterType === '남성' ? 'rgba(54, 162, 235, 1)' : filterType === '전체' ? 'rgba(169, 169, 169, 1)' : 'rgba(255, 99, 132, 1)',
        backgroundColor: filterType === '남성' ? 'rgba(54, 162, 235, 0.2)' : filterType === '전체' ? 'rgba(169, 169, 169, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  // 차트 옵션 설정
  const chartOptions = {
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: '등록 날짜',
        },
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: `가입자 수 (${filterType})`,
        },
        ticks: {
          stepSize: 1,
        },
        suggestedMin: 0,
        suggestedMax: Math.max(...sortedRegDates.map(date => filteredSignupsCount[date].reduce((acc, curr) => acc + curr.count, 0)), 0) + 1,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
      axis: 'x',
      onHover: (event, elements) => {
        event.target.style.cursor = elements.length ? 'pointer' : 'default';
      },
    },
    onClick: handlePointClick, // 클릭 이벤트 핸들러 추가
  };

  // 모달 내용을 담당할 컴포넌트
  const MonthDetailModal = ({ selectedMonthData, selectedDate }) => {
    // 선택된 데이터가 존재하고 적어도 하나의 요소가 있는지 확인
    if (!selectedMonthData || selectedMonthData.length === 0) {
      return null; // 데이터가 없으면 null 반환
    }

    // 각 날짜의 카운트를 누적하는 객체 생성
    const countsByDay = {};
    selectedMonthData.forEach(data => {
      const { day, count } = data;
      if (!countsByDay[day]) {
        countsByDay[day] = count; // 첫 번째 카운트로 초기화
      } else {
        countsByDay[day] += count; // 같은 날짜의 카운트 누적
      }
    });

    // 선택된 날짜 포맷
    const formattedDate = formatDate(new Date(`${selectedDate}-01`));

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg">
          <h3 className="text-lg font-semibold mb-2">{formattedDate} 가입자 상세 정보</h3>
          <ul>
            {/* 각 날짜와 누적된 카운트 렌더링 */}
            {Object.keys(countsByDay).map((day, index) => (
              <li key={index} className="mb-1">{day}일: {countsByDay[day]}명</li>
            ))}
          </ul>
          <button
            className="mt-4 py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={() => setSelectedMonthData(null)}
          >
            닫기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center min-h-[300px] w-[60vw] ">
      <div className="w-full lg:w-3/4 xl:w-2/3">
        <h2 className="text-center mb-4">헬스 등록 차트</h2>
        <div className="flex flex-col items-center lg:flex-row lg:justify-center mb-4">
          {/* 필터 정보 표시 */}
          <div className="mb-2 lg:mb-0 lg:mr-2">
            <p><strong>필터:</strong> {filterType}</p>
          </div>
          {/* 시작 날짜 표시 */}
          <div className="flex items-center mb-2 lg:mb-0 lg:mr-2">
            <p><strong>시작 날짜 :</strong> {formatDate(new Date(start))}</p>
          </div>
          {/* 종료 날짜 표시 */}
          <div className="flex items-center mb-2 lg:mb-0">
            <p><strong>종료 날짜 :</strong> {formatDate(new Date(end))}</p>
          </div>
        </div>
        {/* 차트 컨테이너 */}
        <div className="chart-container relative h-[40vh]">
          <Line data={chartData} options={chartOptions} />
        </div>
        {/* 선택된 월의 상세 정보 모달 */}
        {selectedMonthData && <MonthDetailModal selectedMonthData={selectedMonthData} selectedDate={selectedDate} />}
      </div>
    </div>
  );
};

export default MembershipChart1;
