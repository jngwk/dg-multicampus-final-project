import React from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin, ChartDataLabels);

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

  // Calculate density
  const density = {};
  filteredSessions.forEach(session => {
    const key = `${session.workoutDate}-${session.startTime}`;
    density[key] = (density[key] || 0) + 1;
  });

  const scatterData = filteredSessions.map(session => {
    const sessionDate = new Date(session.workoutDate);
    sessionDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
    const key = `${session.workoutDate}-${session.startTime}`;
    const opacity = Math.min(1, density[key] / 10); // Adjust opacity based on density
    return {
      x: sessionDate,
      y: session.startTime,
      r: sessionCounts[session.workoutDate] * 3, // 세션 수에 비례한 크기
      backgroundColor: `rgba(75, 192, 192, ${opacity})`, // Adjust background color opacity
    };
  });

  const lineData = Object.entries(sessionCounts).map(([date, count]) => {
    const sessionDate = new Date(date);
    sessionDate.setHours(0, 0, 0, 0); // Set time to 00:00:00
    return {
      x: sessionDate,
      y: count,
    };
  });

  const data = {
    datasets: [
      {
        type: 'scatter',
        label: 'PT 선호 시간',
        data: scatterData,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        pointRadius: (context) => context.raw.r,
        pointHoverRadius: (context) => context.raw.r + 2,
        yAxisID: 'y',
        datalabels: {
          display: false, // Disable datalabels for the scatter dataset
        },
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
        datalabels: {
          display: false, // Disable datalabels for the scatter dataset
        },
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
        },
      },
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
              return `날짜: ${context.raw.x.toLocaleDateString()}, 시간: ${context.raw.y},하루 PT 회원 수: ${context.raw.r / 3}`;
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
          text: 'PT 선호 시간',
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
    <div className="bg-white p-6 rounded-lg shadow-lg chart-container relative h-[50dvh]">
        <Scatter data={data} options={options} />
    </div>
  );
};

export default MembershipChart2;
