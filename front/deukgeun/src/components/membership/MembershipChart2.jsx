import React from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MembershipChart2 = ({ ptSessions, ptStart, ptEnd }) => {
  const filteredSessions = ptSessions.filter(session => {
    const sessionDate = new Date(session.workoutDate);
    return sessionDate >= new Date(ptStart) && sessionDate <= new Date(ptEnd);
  });

  const sessionCounts = filteredSessions.reduce((acc, session) => {
    const date = session.workoutDate;
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const scatterData = filteredSessions.map(session => ({
    x: new Date(session.workoutDate),
    y: session.startTime,
    r: sessionCounts[session.workoutDate] * 3, // 세션 수에 비례한 크기
  }));

  const lineData = Object.entries(sessionCounts).map(([date, count]) => ({
    x: new Date(date),
    y: count,
  }));

  const data = {
    datasets: [
      {
        type: 'scatter',
        label: 'PT 세션',
        data: scatterData,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        pointRadius: (context) => context.raw.r,
        pointHoverRadius: (context) => context.raw.r + 2,
        yAxisID: 'y',
      },
      {
        type: 'line',
        label: '일별 PT 수',
        data: lineData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        fill: true,
        yAxisID: 'y1',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'PT 선호도 및 일별 세션 수',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (context.datasetIndex === 0) {
              return `날짜: ${context.raw.x.toLocaleDateString()}, 시간: ${context.raw.y}, 세션 수: ${context.raw.r / 3}`;
            } else {
              return `날짜: ${context.raw.x.toLocaleDateString()}, PT 수: ${context.raw.y}`;
            }
          },
        },
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MM/dd'
          }
        },
        title: {
          display: true,
          text: '날짜',
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        type: 'time',
        time: {
          parser: 'HH:mm',
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm'
          },
        },
        title: {
          display: true,
          text: 'PT 시간',
        },
        position: 'left',
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: '일별 PT 수',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          font: {
            size: 10,
          },
          stepSize: 1,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div style={{ height: '400px' }}>
        <Scatter data={data} options={options} />
      </div>
    </div>
  );
};

export default MembershipChart2;