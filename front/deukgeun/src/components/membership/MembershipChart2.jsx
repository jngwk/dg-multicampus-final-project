import React from 'react';
import { Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';

// Chart.js 요소 등록
ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MembershipChart2 = ({ ptSessions, minPtDate, maxPtDate, ptStart, ptEnd }) => {
  // 날짜를 'yyyy-MM-dd' 형식으로 포맷하는 함수
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // 차트 데이터와 옵션을 준비하는 함수
  const prepareChartData = () => {
    // 각 날짜별 세션 수 카운트
    const sessionCount = {};
    ptSessions.forEach(session => {
      const date = session.workoutDate;
      sessionCount[date] = sessionCount[date] ? sessionCount[date] + 1 : 1;
    });

    // 선택된 날짜 범위 내의 세션 필터링
    const filteredSessions = ptSessions.filter(session => {
      const sessionDate = new Date(session.workoutDate);
      return sessionDate >= new Date(ptStart) && sessionDate <= new Date(ptEnd);
    });

    // 필터링된 세션별 카운트
    const filteredSessionCount = {};
    filteredSessions.forEach(session => {
      const date = session.workoutDate;
      filteredSessionCount[date] = filteredSessionCount[date] ? filteredSessionCount[date] + 1 : 1;
    });

    // 최소 및 최대 세션 시작 시간 찾기
    let minTime = '23:59';
    let maxTime = '00:00';
    filteredSessions.forEach(session => {
      const startTime = session.startTime;
      if (startTime < minTime) minTime = startTime;
      if (startTime > maxTime) maxTime = startTime;
    });

    // 시간을 한 시간씩 조정
    minTime = timeAdjust(minTime, -60); // 최소 시간을 1시간 전으로 조정
    maxTime = timeAdjust(maxTime, 60);  // 최대 시간을 1시간 후로 조정

    // y축을 위한 최소 및 최대 카운트 계산
    let minCount = 0;
    let maxCount = Math.max(...Object.values(filteredSessionCount)) + 1;

    // 차트 데이터 구성
    const data = {
      datasets: [
        {
          label: 'PT 시간',
          type: 'bubble',
          data: filteredSessions.map(session => ({ x: session.workoutDate, y: session.startTime, r: 7 })),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
        },
        {
          label: '일별 PT 수(전체)',
          type: 'line',
          data: Object.keys(filteredSessionCount).map(date => ({ x: date, y: filteredSessionCount[date] })),
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          yAxisID: 'y2',
          fill: false,
        },
      ],
    };

    // 차트 옵션 설정
    const options = {
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        x: {
          type: 'time',
          time: {
            tooltipFormat: 'yyyy-MM-dd',
            displayFormats: { day: 'yyyy-MM-dd' },
            parser: 'yyyy-MM-dd',
            unit: 'day',
            unitStepSize: 1,
            min: ptStart,
            max: ptEnd,
          },
          title: { display: true, text: '날짜' },
        },
        y1: {
          type: 'time',
          position: 'left',
          time: {
            tooltipFormat: 'HH:mm',
            displayFormats: { hour: 'HH:mm' },
            parser: 'HH:mm',
            unit: 'hour',
            unitStepSize: 1,
          },
          title: { display: true, text: 'PT 등록 시간' },
          min: timeAdjust(minTime, -60), // 최소 시간을 1시간 전으로 조정
          max: timeAdjust(maxTime, 60),  // 최대 시간을 1시간 후로 조정
        },
        y2: {
          type: 'linear',
          position: 'right',
          title: { display: true, text: 'PT 가입 수(전체)' },
          ticks: { stepSize: 1 },
          min: 0,
          max: maxCount,
        },
      },
    };

    return { data, options };
  };

  // 시간을 조정하는 함수
  const timeAdjust = (timeString, minutes) => {
    const [hours, minutesStr] = timeString.split(':');
    let adjustedHours = parseInt(hours, 10);
    let adjustedMinutes = parseInt(minutesStr, 10) + minutes;
    if (adjustedMinutes < 0) { adjustedHours--; adjustedMinutes += 60; }
    else if (adjustedMinutes >= 60) { adjustedHours++; adjustedMinutes -= 60; }
    adjustedHours = (adjustedHours + 24) % 24;
    return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
  };

  // 차트 데이터 및 옵션을 가져오기
  const { data, options } = prepareChartData();

  return (
    <div className="flex justify-center items-center min-h-[300px] w-[60vw]">
      <div className="w-full lg:w-3/4 xl:w-2/3">
        <h2 className="text-center mb-4">PT 선호도 차트</h2>
        <div className="flex flex-col items-center lg:flex-row lg:justify-center mb-4">
          {/* 시작 날짜 표시 */}
          <div className="flex items-center mb-2 lg:mb-0 lg:mr-2">
            <p><strong>시작 날짜 :</strong> {ptStart}</p>
          </div>
          {/* 종료 날짜 표시 */}
          <div className="flex items-center mb-2 lg:mb-0 lg:mr-2">
            <p><strong>종료 날짜 :</strong> {ptEnd}</p>
          </div>
        </div>
        {/* 차트 컨테이너 */}
        <div className="chart-container relative h-[40vh]">
          <Bubble data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default MembershipChart2;
