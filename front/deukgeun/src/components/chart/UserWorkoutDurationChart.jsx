import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getMembershipStats } from '../../api/membershipApi';

function UserWorkoutDurationChart() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getMembershipStats(); // 백엔드에서 회원 통계 데이터 가져오기
        const workoutData = []; // 월별 운동 시간 데이터 배열 초기화

        // 월별 운동 시간 데이터 추출
        stats.forEach((membership) => {
          workoutData.push({
            month: membership.month, // 월 정보
            duration: membership.userWorkoutDuration, // 운동 시간
          });
        });

        // 차트에 필요한 데이터 추출 (라벨과 값)
        const labels = workoutData.map((entry) => entry.month);
        const values = workoutData.map((entry) => entry.duration);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Workout Duration (minutes)',
              data: values,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
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
      <h1 className="text-xl font-bold mb-4">User Workout Duration Chart</h1>
      <Line data={chartData} />
    </div>
  );
}

export default UserWorkoutDurationChart;