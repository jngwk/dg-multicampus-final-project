import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns'; // date-fns adapter import
import Button from '../shared/Button';

// Chart.js component registration
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const TestChart = ({ stats }) => {
  const [filterType, setFilterType] = useState('전체'); // State to track filter type ('전체', '남성', '여성')
  const [start, setStart] = useState(''); // State for start date
  const [end, setEnd] = useState(''); // State for end date

  // Initialize start and end dates based on stats data
  useEffect(() => {
    if (stats.length > 0) {
      const earliestDate = new Date(Math.min(...stats.map(item => new Date(item.expDate))));
      const latestDate = new Date(Math.max(...stats.map(item => new Date(item.expDate))));
      setStart(formatDate(earliestDate)); // Assuming formatDate is a function to format date as 'YYYY-MM-DD'
      setEnd(formatDate(latestDate)); // Assuming formatDate is a function to format date as 'YYYY-MM-DD'
    }
  }, [stats]);

  // Function to format date as 'YYYY-MM-DD'
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Function to count signups per expiration date
  const countSignupsPerExpDate = (stats, filter, startDate, endDate) => {
    const counts = {};
    stats.forEach(membership => {
      const expDate = new Date(membership.expDate);
      const year = expDate.getFullYear();
      const month = expDate.getMonth() + 1; // getMonth() returns zero-based month
      const combinedDate = `${year}-${month}`;

      // Filter by start and end dates
      const isInRange =
        (!startDate || expDate >= new Date(startDate)) &&
        (!endDate || expDate <= new Date(endDate));

      if (isInRange) {
        if (filter === '전체' || membership.userGender === filter) {
          if (!counts[combinedDate]) {
            counts[combinedDate] = 0;
          }
          counts[combinedDate]++;
        }
      }
    });
    return counts;
  };

  // Handler for filter change
  const handleFilterChange = (event) => {
    setFilterType(event.target.value);
  };

  // Handler for start date change
  const handleStartDateChange = (event) => {
    setStart(event.target.value);
  };

  // Handler for end date change
  const handleEndDateChange = (event) => {
    setEnd(event.target.value);
  };

  // Handler for resetting filters
  const handleResetFilters = () => {
    setFilterType('전체');
    setStart(formatDate(new Date(Math.min(...stats.map(item => new Date(item.expDate))))));
    setEnd(formatDate(new Date(Math.max(...stats.map(item => new Date(item.expDate))))));
  };

  // Calculate filtered signup counts
  const filteredSignupsCount = countSignupsPerExpDate(stats, filterType, start, end);
  const sortedExpDates = Object.keys(filteredSignupsCount).sort((a, b) => new Date(a) - new Date(b)); // Sorted expiration dates array
  const signupsData = sortedExpDates.map(date => filteredSignupsCount[date]); // Array of signup counts based on filter

  // Calculate max signup count
  const maxSignups = Math.max(...signupsData, 0);

  // Chart data and options
  const chartData = {
    labels: sortedExpDates,
    datasets: [
      {
        label: `가입자 수 (${filterType})`,
        data: signupsData,
        borderColor: filterType === '남성' ? 'rgba(54, 162, 235, 1)' : filterType === '전체' ? 'rgba(169, 169, 169, 1)' : 'rgba(255, 99, 132, 1)',
        backgroundColor: filterType === '남성' ? 'rgba(54, 162, 235, 0.2)' : filterType === '전체' ? 'rgba(169, 169, 169, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        type: 'category', // Use 'category' scale for labels
        title: {
          display: true,
          text: '등록 날짜', // X-axis label
        },
      },
      y: {
        type: 'linear', // Use 'linear' scale for person count
        title: {
          display: true,
          text: `가입자 수 (${filterType})`, // Y-axis label with filterType dynamically included
        },
        ticks: {
          stepSize: 1, // Ensure y-axis ticks are whole numbers
        },
        suggestedMin: 0, // Ensure the y-axis starts from 0
        suggestedMax: maxSignups + 1, // Set y-axis max to max value in data + 1
      },
    },
    plugins: {
      legend: {
        display: true, // Display legend
      },
    },
  };

  return (
    <div className="w-full lg:w-2/3 xl:w-1/2 mx-auto">
      <h2 className="text-center mb-4">멤버십 등록 날짜 차트</h2>
      <div className="flex flex-col items-center lg:flex-row lg:justify-center mb-4">
        <div className="mb-2 lg:mb-0 lg:mr-2">
          <select value={filterType} onChange={handleFilterChange} className="px-3 py-2 border rounded-md">
            <option value="전체">전체</option>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>
        </div>
        <div className="flex items-center mb-2 lg:mb-0 lg:mr-2">
          <label className="mr-2">Start:</label>
          <input type="date" value={start} onChange={handleStartDateChange} className="px-3 py-2 border rounded-md" />
        </div>
        <div className="flex items-center mb-2 lg:mb-0 lg:mr-2">
          <label className="mr-2">End:</label>
          <input type="date" value={end} onChange={handleEndDateChange} className="px-3 py-2 border rounded-md" />
        </div>
        <div>
          <Button label="리셋" onClick={handleResetFilters} width='150px'/>
        </div>
      </div>
      <div className="flex flex-col items-center lg:flex-row lg:justify-center mb-4">
        <p className="mb-2 lg:mb-0"><strong>Start:</strong> {start}</p>
        <p className="mb-2 lg:mb-0 lg:ml-4"><strong>End:</strong> {end}</p>
      </div>
      <div className="lg:w-full h-auto lg:h-96 xl:h-96">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default TestChart;
