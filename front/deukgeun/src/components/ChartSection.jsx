import React from 'react';
import { Line } from 'react-chartjs-2';

const ChartSection = ({ statsData }) => {
  const { weeklyStats, lastMonthStats } = statsData;

  const chartData = {
    labels: weeklyStats.labels,
    datasets: [
      {
        label: 'This Week',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
        data: weeklyStats.data,
      },
      {
        label: 'Last Month',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
        data: lastMonthStats.data,
      },
    ],
  };

  return (
    <div className="chart-section">
      <h2>Weekly Registration Statistics</h2>
      <Line data={chartData} />
    </div>
  );
};

export default ChartSection;
