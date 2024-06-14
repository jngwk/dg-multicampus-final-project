import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { getMembershipStats } from '../../api/membershipApi';

function UserMemberReasonChart() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getMembershipStats(); // 백엔드에서 회원 통계 데이터 가져오기
        const memberReasons = {}; // 회원 가입 이유 별 사용자 수를 저장할 객체 초기화

        // 회원 가입 이유 별 사용자 수 계산
        stats.forEach((membership) => {
          const reason = membership.userMemberReason;
          if (reason in memberReasons) {
            memberReasons[reason]++;
          } else {
            memberReasons[reason] = 1;
          }
        });

        // 차트에 필요한 데이터 추출 (라벨과 값)
        const labels = Object.keys(memberReasons);
        const values = Object.values(memberReasons);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Member Reasons',
              data: values,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#8A2BE2',
                '#00FF7F',
                '#FF4500',
              ],
              hoverBackgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#8A2BE2',
                '#00FF7F',
                '#FF4500',
              ],
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
      <h1 className="text-xl font-bold mb-4">User Member Reason Chart</h1>
      <Pie data={chartData} />
    </div>
  );
}

export default UserMemberReasonChart;
