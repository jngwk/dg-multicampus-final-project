import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { getISOWeek } from "date-fns"; // Import getISOWeek from date-fns
import "chartjs-adapter-date-fns"; // date-fns 어댑터 import

// 필요한 Chart.js 컴포넌트 등록
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

const TestChart = ({ stats }) => {
  const [filterType, setFilterType] = useState("전체"); // 필터 타입을 추적하는 상태 변수 (전체, 남성, 여성)
  const [yearMonthFilter, setYearMonthFilter] = useState(""); // 연도-월 필터 상태 변수
  const [timeGranularity, setTimeGranularity] = useState("month"); // 시간 단위 필터 상태 변수 (month, week)

  // 만료 날짜별 가입자 수를 계산하는 함수
  const countSignupsPerExpDate = (stats, filter) => {
    const counts = {};
    stats.forEach((membership) => {
      if (filter === "전체" || membership.userGender === filter) {
        const expDate = new Date(membership.expDate);
        let combinedDate;
        
        if (timeGranularity === "month") {
          const year = expDate.getFullYear();
          const month = expDate.getMonth() + 1; // getMonth()는 0부터 시작하는 월을 반환
          combinedDate = `${year}-${month}`;
        } else if (timeGranularity === "week") {
          const year = expDate.getFullYear();
          const week = getISOWeek(new Date(expDate));
          combinedDate = `${year}-W${week}`;
        }

        if (!counts[combinedDate]) {
          counts[combinedDate] = 0;
        }
        counts[combinedDate]++;
      }
    });
    return counts;
  };

  // 필터 변경 처리 함수
  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  // 연도-월 필터 변경 처리 함수
  const handleYearMonthFilterChange = (event) => {
    setYearMonthFilter(event.target.value);
  };

  // 시간 단위 필터 변경 처리 함수
  const handleTimeGranularityChange = (event) => {
    setTimeGranularity(event.target.value);
  };

  // 현재 필터에 따라 필터링된 데이터 계산
  const filteredSignupsCount = countSignupsPerExpDate(stats, filterType);
  const expDates = Object.keys(filteredSignupsCount).map((key) => key); // 필터링된 만료 날짜 배열
  const signupsData = Object.values(filteredSignupsCount); // 필터에 따른 가입자 수 배열

  // 가입자 수의 최대값 계산
  const maxSignups = Math.max(...signupsData, 0);

  const chartData = {
    labels: expDates,
    datasets: [
      {
        label: `가입자 수 (${filterType})`,
        data: signupsData,
        borderColor:
          filterType === "남성"
            ? "rgba(54, 162, 235, 1)"
            : filterType === "전체"
            ? "rgba(169, 169, 169, 1)"
            : "rgba(255, 99, 132, 1)",
        backgroundColor:
          filterType === "남성"
            ? "rgba(54, 162, 235, 0.2)"
            : filterType === "전체"
            ? "rgba(169, 169, 169, 0.2)"
            : "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: "category", // Use 'category' scale for labels
        title: {
          display: true,
          text: "등록 날짜", // X-axis label
        },
      },
      y: {
        type: "linear", // Use 'linear' scale for person count
        title: {
          display: true,
          text: `가입자 수 (${filterType})`, // Y-axis label with filterType dynamically included
          align: "center", // Center align the text
          scriptable: (ctx) => {
            // Ensure the text is displayed horizontally
            return "가입자 수 (" + ctx.chart.options.filterType + ")";
          },
          padding: {
            top: 10,
            bottom: 10,
          },
        },
        ticks: {
          stepSize: 1, // Ensure y-axis ticks are whole numbers
        },
        suggestedMin: 0, // Ensure the y-axis starts from 0
        suggestedMax: maxSignups + 1, // y축의 최대값을 데이터의 최대값 +1로 설정
      },
    },
    plugins: {
      legend: {
        display: true, // Display legend
        labels: {
          filter: (legendItem) => {
            return legendItem.text !== filterType;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "500px" }}>
      <h2>멤버십 등록 날짜 차트</h2>
      <div className="flex justify-between items-center mb-4">
        <div>
          <label htmlFor="filterType" className="mr-2">
            필터:
          </label>
          <select
            id="filterType"
            value={filterType}
            onChange={handleFilterChange}
          >
            <option value="전체">전체</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
        </div>
        <div>
          <label htmlFor="yearMonthFilter" className="mr-2">
            년-월 필터:
          </label>
          <input
            type="month"
            id="yearMonthFilter"
            value={yearMonthFilter}
            onChange={handleYearMonthFilterChange}
          />
        </div>
        <div>
          <label htmlFor="timeGranularity" className="mr-2">
            시간 단위:
          </label>
          <select
            id="timeGranularity"
            value={timeGranularity}
            onChange={handleTimeGranularityChange}
          >
            <option value="month">월 단위</option>
            <option value="week">주 단위</option>
          </select>
        </div>
      </div>
      <div className="w-full h-96">
        {/* 예시: Tailwind CSS 클래스 사용 */}
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default TestChart;
