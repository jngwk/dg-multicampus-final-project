import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const colors = {
  male: {
    backgroundColor: [
      'rgba(0, 119, 182, 0.8)',
      'rgba(3, 4, 94, 0.8)',
      'rgba(0, 180, 216, 0.8)',
      'rgba(72, 202, 228, 0.8)',
      'rgba(144, 224, 239, 0.8)',
      'rgba(202, 240, 248, 0.8)',
    ],
    borderColor: [
      'rgba(0, 119, 182, 1)',
      'rgba(3, 4, 94, 1)',
      'rgba(0, 180, 216, 1)',
      'rgba(72, 202, 228, 1)',
      'rgba(144, 224, 239, 1)',
      'rgba(202, 240, 248, 1)',
    ],
  },
  female: {
    backgroundColor: [
      'rgba(255, 99, 132, 0.8)',
      'rgba(255, 159, 64, 0.8)',
      'rgba(255, 205, 86, 0.8)',
      'rgba(75, 192, 192, 0.8)',
      'rgba(153, 102, 255, 0.8)',
      'rgba(201, 203, 207, 0.8)',
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(255, 159, 64, 1)',
      'rgba(255, 205, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
      'rgba(201, 203, 207, 1)',
    ],
  },
};

const baseOptions = {
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

const AdditionalCharts = ({ stats }) => {
  const { memberReasonByGender, genderRatio } = useMemo(() => {
    return stats.reduce(
      (acc, { userGender, userMemberReason }) => {
        if (!acc.memberReasonByGender[userGender]) {
          acc.memberReasonByGender[userGender] = {};
        }
        acc.memberReasonByGender[userGender][userMemberReason] = 
          (acc.memberReasonByGender[userGender][userMemberReason] || 0) + 1;

        acc.genderRatio[userGender === "남성" ? "male" : "female"]++;

        return acc;
      },
      { memberReasonByGender: {}, genderRatio: { male: 0, female: 0 } }
    );
  }, [stats]);

  const createMemberReasonData = (gender) => {
    const genderKey = gender.toLowerCase() === '남성' ? 'male' : 'female';
    return {
      labels: Object.keys(memberReasonByGender[gender] || {}),
      datasets: [
        {
          data: Object.values(memberReasonByGender[gender] || {}),
          backgroundColor: colors[genderKey].backgroundColor,
          borderColor: colors[genderKey].borderColor,
          borderWidth: 1,
        },
      ],
    };
  };

  const renderPieChart = (data, title) => (
    <div className="bg-white p-6 rounded-lg shadow-lg h-[50dvh] flex justify-center items-center">
      <Pie
        data={data}
        options={{
          ...baseOptions,
          plugins: {
            ...baseOptions.plugins,
            title: { ...baseOptions.plugins.title, text: title },
          },
        }}
      />
    </div>
  );

  const totalMembers = genderRatio.male + genderRatio.female;
  const getPercentage = (value) => ((value / totalMembers) * 100).toFixed(1);

  const GenderRatioChart = () => {
    const malePercentage = getPercentage(genderRatio.male);
    const femalePercentage = getPercentage(genderRatio.female);

    return (
      <div className="bg-white p-6 rounded-lg shadow-lg h-[50dvh] flex justify-center items-center">
        <h2 className="text-lg font-semibold mb-4 text-center">남녀 회원 비율</h2>
        <div className="relative">
          <svg width="100%" height="100%" viewBox="0 0 200 100">
            {/* 여성 아이콘 */}
            <svg x="10" y="25" width="50" height="50" viewBox="0 0 24 24" fill="#FF69B4">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            <rect x="60" y="45" width={femalePercentage} height="10" fill="#FF69B4" />
            <text x="60" y="40" fontSize="12" fill="#333">{femalePercentage}%</text>
            
            {/* 남성 아이콘 */}
            <svg x="140" y="25" width="50" height="50" viewBox="0 0 24 24" fill="#4169E1">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
            <rect x={140 - malePercentage} y="45" width={malePercentage} height="10" fill="#4169E1" />
            <text x={140 - malePercentage} y="40" fontSize="12" fill="#333">{malePercentage}%</text>
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {renderPieChart(createMemberReasonData("여성"), "여성 등록 사유")}
      <GenderRatioChart />
      {renderPieChart(createMemberReasonData("남성"), "남성 등록 사유")}
    </div>
  );
};

export default AdditionalCharts;