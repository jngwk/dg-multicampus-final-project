import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Scatter } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';

ChartJS.register(TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, zoomPlugin, ChartDataLabels);

const MembershipChart2 = ({ ptSessions, ptStart, ptEnd, onZoomToNextWeek, isZoomEnabled, isPanEnabled, toggleZoom, resetZoom, setChartRef }) => {
  const [selectedSession, setSelectedSession] = useState(null);
  const chartRef = React.useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      setChartRef(chartRef.current);
    }
  }, [chartRef, setChartRef]);

  const generateDataForDateRange = (start, end) => {
    const data = [];
    const currentDate = new Date(start);
    const endDate = new Date(end);

    while (currentDate <= endDate) {
      const formattedDate = formatDate(currentDate);
      const sessionsForDay = ptSessions.filter(session => session.workoutDate === formattedDate);

      if (sessionsForDay.length > 0) {
        sessionsForDay.forEach(session => {
          const [hours, minutes] = session.startTime.split(':').map(Number);
          const timeValue = hours + minutes / 60; // 시간을 소수점으로 변환

          const density = sessionsForDay.filter(s => s.startTime === session.startTime).length;
          const opacity = Math.min(1, density / 10);
          
          // UTC 시간으로 설정
          const utcDate = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
          
          data.push({
            x: utcDate,
            y: timeValue,
            r: density,
            backgroundColor: `rgba(255, 99, 1325, ${opacity})`,
            borderColor: 'rgba(255, 99, 132, 1)',
            session: session
          });
        });
      } else {
        // 데이터가 없는 날짜에 대해 빈 데이터 포인트 추가
        const utcDate = Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        data.push({
          x: utcDate,
          y: null,
          r: 0
        });
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return data;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const scatterData = generateDataForDateRange(ptStart, ptEnd);

  const data = {
    datasets: [
      {
        type: 'scatter',
        label: 'PT 선호 시간',
        data: scatterData,
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        pointRadius: (context) => context.raw.r * 3,
        pointHoverRadius: (context) => context.raw.r * 3 + 2,
        yAxisID: 'y',
        datalabels: {
          display: false,
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
            enabled: isZoomEnabled,
          },
          pinch: {
            enabled: isZoomEnabled
          },
          mode: 'xy',
        },
        pan: {
          enabled: isPanEnabled,
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
            if (context.raw.session) {
              const date = new Date(context.raw.x);
              const hours = Math.floor(context.raw.y);
              const minutes = Math.round((context.raw.y - hours) * 60);
              const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
              return `날짜: ${date.toLocaleDateString()}, 시간: ${timeString}, 해당 시간 PT 회원 수: ${context.raw.r}`;
            } else {
              const date = new Date(context.raw.x);
              return `날짜: ${date.toLocaleDateString()}, 데이터 없음`;
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
          },
        },
        title: {
          display: true,
          text: '날짜',
        },
        ticks: {
          source: 'data',
          font: {
            size: 10,
          },
        },
      },
      y: {
        type: 'linear',
        offset: true, // Ensure that the y-axis labels remain fixed
        min: 0,
        max: 24,
        title: {
          display: true,
          text: 'PT 선호 시간',
        },
        ticks: {
          stepSize: 1,
          callback: function(value) {
            const hours = Math.floor(value);
            const minutes = Math.round((value - hours) * 60);
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
          },
          font: {
            size: 10,
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
    },
    onClick: (_, elements) => {
      if (elements.length > 0) {
        const { datasetIndex, index } = elements[0];
        const session = data.datasets[datasetIndex].data[index].session;
        if (session) {
          setSelectedSession(session);
        }
      }
    },
  };

  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          {children}
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg chart-container relative h-[50dvh]">
      <Scatter ref={chartRef} data={data} options={options} />
      <Modal isOpen={!!selectedSession} onClose={() => setSelectedSession(null)}>
        {selectedSession && (
          <>
            <h3 className="text-lg font-semibold mb-2">세션 상세 정보</h3>
            <p><strong>날짜:</strong> {selectedSession.workoutDate}</p>
            <p><strong>시작 시간:</strong> {selectedSession.startTime}</p>
            <p><strong>내용:</strong> {selectedSession.content}</p>
            <p><strong>체중:</strong> {selectedSession.bodyWeight} kg</p>
          </>
        )}
      </Modal>
    </div>
  );
};

export default MembershipChart2;
