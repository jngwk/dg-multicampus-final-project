import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getMembershipStats } from '../../api/membershipApi';

function UserAgeChart() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getMembershipStats(); // 백엔드에서 회원 통계 데이터 가져오기
        const ageGroups = {}; // 나이 그룹 별 사용자 수를 저장할 객체 초기화

        // 나이 그룹 별 사용자 수 계산
        stats.forEach((membership) => {
          const ageGroup = membership.userAge;
          if (ageGroup in ageGroups) {
            ageGroups[ageGroup]++;
          } else {
            ageGroups[ageGroup] = 1;
          }
        });

        // 차트에 필요한 데이터 추출 (라벨과 값)
        const labels = Object.keys(ageGroups);
        const values = Object.values(ageGroups);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Users by Age Group',
              data: values,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">User Age Chart</h1>
      <Bar data={chartData} />
    </div>
  );
}

export default UserAgeChart;
