import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MembershipChart1 = ({ stats, filterType, start, end }) => {
  const [selectedMonthData, setSelectedMonthData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredStats = stats.filter(stat => {
    const statDate = new Date(stat.regDate);
    return statDate >= new Date(start) && statDate <= new Date(end) &&
           (filterType === '전체' || stat.userGender === filterType);
  });

  const monthlyData = filteredStats.reduce((acc, stat) => {
    const month = stat.regDate.slice(0, 7);
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const sortedMonths = Object.keys(monthlyData).sort();

  const getColor = () => {
    switch(filterType) {
      case '남성':
        return 'rgba(54, 162, 235, 1)';
      case '여성':
        return 'rgba(255, 99, 132, 1)';
      default:
        return 'rgba(75, 192, 192, 1)';
    }
  };

  const data = {
    labels: sortedMonths,
    datasets: [
      {
        label: `가입자 수 (${filterType})`,
        data: sortedMonths.map(month => monthlyData[month]),
        borderColor: getColor(),
        backgroundColor: getColor().replace('1)', '0.2)'),
        tension: 0.25,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: getColor(),
        pointHoverBorderColor: 'white',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '헬스장 등록 현황',
        font: {
          size: 18,
          weight: 'bold',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `가입자 수: ${context.parsed.y}`,
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
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(0,0,0,0.1)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
    onClick: (_, elements) => {
      if (elements.length > 0) {
        const monthIndex = elements[0].index;
        const selectedMonth = sortedMonths[monthIndex];
        const monthDetails = filteredStats
          .filter(stat => stat.regDate.startsWith(selectedMonth))
          .sort((a, b) => new Date(a.regDate) - new Date(b.regDate)); // 날짜순 정렬
        setSelectedMonthData(monthDetails);
        setIsModalOpen(true);
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
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
  <div className="bg-white p-6 rounded-lg shadow-lg chart-container relative h-[50dvh] flex justify-center items-center">
    <Line data={data} options={options} />
    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <h3 className="text-lg font-semibold mb-2">선택한 월 상세 정보</h3>
      <ul className="max-h-60 overflow-y-auto">
        {selectedMonthData && selectedMonthData.map((stat, index) => (
          <li key={index} className="text-sm py-1">
            {new Date(stat.regDate).toLocaleDateString('ko-KR', { 
              year: 'numeric', 
              month: '2-digit', 
              day: '2-digit', 
              weekday: 'short' 
            })}: {stat.userGender}
          </li>
        ))}
      </ul>
    </Modal>
  </div>
);
};

export default MembershipChart1;