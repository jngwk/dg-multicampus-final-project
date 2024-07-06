import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import chartCenterImage from "../../assets/chartCenterImage.png";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
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
    datalabels: {
      formatter: (value, context) => {
        const total = context.chart.data.datasets[0].data.reduce((acc, data) => acc + data, 0);
        const percentage = ((value / total) * 100).toFixed(1);
        return `${percentage}%`;
      },
      color: '#fff',
      font: {
        weight: 'bold',
        size: 14,
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
    const data = memberReasonByGender[gender] || {};
    const total = Object.values(data).reduce((sum, value) => sum + value, 0);

    const sortedData = Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    return {
      labels: Object.keys(sortedData),
      datasets: [
        {
          data: Object.values(sortedData),
          backgroundColor: colors[genderKey].backgroundColor,
          borderColor: colors[genderKey].borderColor,
          borderWidth: 1,
        },
      ],
    };
  };

  const totalMembers = genderRatio.male + genderRatio.female;
  const getPercentage = (value) => ((value / totalMembers) * 100).toFixed(1);

  const calculateStats = (gender) => {
    const genderStats = stats.filter(s => s.userGender === gender);
    return {
      avgAge: (genderStats.reduce((sum, s) => sum + s.userAge, 0) / genderStats.length).toFixed(1),
      avgWorkoutDuration: (Math.round((genderStats.reduce((sum, s) => sum + s.userWorkoutDuration, 0) / genderStats.length) * 10) / 10),
      topReason: Object.entries(genderStats.reduce((acc, s) => {
        acc[s.userMemberReason] = (acc[s.userMemberReason] || 0) + 1;
        return acc;
      }, {})).sort((a, b) => b[1] - a[1])[0][0]
    };
  };

  const maleStats = calculateStats('남성');
  const femaleStats = calculateStats('여성');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-lg h-[50dvh] flex justify-center items-center">
        <Pie
          data={createMemberReasonData("남성")}
          options={{
            ...baseOptions,
            plugins: {
              ...baseOptions.plugins,
              title: { ...baseOptions.plugins.title, text: "남성 등록 사유" },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: ${percentage}% (${value})`;
                  }
                }
              }
            },
          }}
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">남녀 표준모델</h2>
        <div className="flex justify-between items-center">
          <div className="text-center text-blue-600 w-1/4">
            <h3 className="font-bold text-xl mb-2">남성</h3>
          </div>
          <div className="w-1/2 relative">
            <img src={chartCenterImage} alt="Couple" className="w-full" />
          </div>
          <div className="text-center text-red-500 w-1/4">
            <h3 className="font-bold text-xl mb-2">여성</h3>
          </div>
        </div>
        <div className="mt-6">
          <div className="flex justify-between items-center my-2">
            <span className="w-1/4 text-right pr-4">{maleStats.avgAge}세</span>
            <span className="w-1/2 text-center font-bold">평균 나이</span>
            <span className="w-1/4 text-left pl-4">{femaleStats.avgAge}세</span>
          </div>
          <div className="flex justify-between items-center my-2">
            <span className="w-1/4 text-right pr-4">{maleStats.avgWorkoutDuration}년</span>
            <span className="w-1/2 text-center font-bold">평균 운동 경력</span>
            <span className="w-1/4 text-left pl-4">{femaleStats.avgWorkoutDuration}년</span>
          </div>
          <div className="flex justify-between items-center my-2">
            <span className="w-1/4 text-right pr-4">{maleStats.topReason}</span>
            <span className="w-1/2 text-center font-bold">주요 등록 이유</span>
            <span className="w-1/4 text-left pl-4">{femaleStats.topReason}</span>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg h-[50dvh] flex justify-center items-center">
        <Pie
          data={createMemberReasonData("여성")}
          options={{
            ...baseOptions,
            plugins: {
              ...baseOptions.plugins,
              title: { ...baseOptions.plugins.title, text: "여성 등록 사유" },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.label || '';
                    const value = context.raw || 0;
                    const total = context.dataset.data.reduce((acc, data) => acc + data, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: ${percentage}% (${value})`;
                  }
                }
              }
            },
          }}
        />
      </div>
    </div>
  );
};

export default AdditionalCharts;
