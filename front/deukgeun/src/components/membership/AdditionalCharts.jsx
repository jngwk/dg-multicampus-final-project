import React from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdditionalCharts = ({ stats }) => {
  // 연령대별 회원 분포 계산
  const ageDistribution = stats.reduce((acc, member) => {
    const age = member.userAge;
    if (age <= 20) acc['20대 이하']++;
    else if (age <= 30) acc['20-30대']++;
    else if (age <= 40) acc['30-40대']++;
    else if (age <= 50) acc['40-50대']++;
    else acc['50대 이상']++;
    return acc;
  }, { '20대 이하': 0, '20-30대': 0, '30-40대': 0, '40-50대': 0, '50대 이상': 0 });

  // 남녀 비율 계산
  const genderRatio = stats.reduce((acc, member) => {
    member.userGender === '남성' ? acc.male++ : acc.female++;
    return acc;
  }, { male: 0, female: 0 });

  const ageDistributionData = {
    labels: Object.keys(ageDistribution),
    datasets: [
      {
        data: Object.values(ageDistribution),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const genderRatioData = {
    labels: ['남성', '여성'],
    datasets: [
      {
        data: [genderRatio.male, genderRatio.female],
        backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
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
        font: {
          size: 18,
          weight: 'bold',
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">연령대별 회원 분포</h2>
        <Pie data={ageDistributionData} options={{...options, plugins: {...options.plugins, title: {...options.plugins.title, text: '연령대별 회원 분포'}}}} />
      </div>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-center">남녀 회원 비율</h2>
        <Bar 
          data={genderRatioData} 
          options={{
            ...options,
            plugins: {...options.plugins, title: {...options.plugins.title, text: '남녀 회원 비율'}},
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: '회원 수',
                },
              },
            },
          }} 
        />
        <div className="flex justify-center mt-4">
          <div className="flex items-center mr-4">
            <div className="w-4 h-4 bg-blue-500 mr-2"></div>
            <span>남성: {((genderRatio.male / (genderRatio.male + genderRatio.female)) * 100).toFixed(1)}%</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-pink-500 mr-2"></div>
            <span>여성: {((genderRatio.female / (genderRatio.male + genderRatio.female)) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalCharts;