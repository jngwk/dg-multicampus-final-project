import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getMembershipStats } from '../../api/membershipApi';

function UserGenderChart() {
  
    return (
      <div className="bg-white p-4 rounded shadow">
        <h1 className="text-xl font-bold mb-4">User Gender Page</h1>
        <p>여기는 유저 성별 페이지입니다.</p>
      </div>
    );
  

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const stats = await getMembershipStats(); // 백엔드에서 회원 통계 데이터 가져오기
  //       const genders = {}; // 성별 별 사용자 수를 저장할 객체 초기화

  //       // 성별 별 사용자 수 계산
  //       stats.forEach((membership) => {
  //         const gender = membership.userGender;
  //         if (gender in genders) {
  //           genders[gender]++;
  //         } else {
  //           genders[gender] = 1;
  //         }
  //       });

  //       // 차트에 필요한 데이터 추출 (라벨과 값)
  //       const labels = Object.keys(genders);
  //       const values = Object.values(genders);

  //       setChartData({
  //         labels: labels,
  //         datasets: [
  //           {
  //             label: 'Users by Gender',
  //             data: values,
  //             borderColor: 'rgba(54, 162, 235, 1)',
  //             backgroundColor: 'rgba(54, 162, 235, 0.2)',
  //             fill: true,
  //           },
  //         ],
  //       });

  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //       setError(error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  // if (error) {
  //   return <p>Error: {error.message}</p>;
  // }

  return (
    // <div className="bg-white p-4 rounded shadow">
    //   <h1 className="text-xl font-bold mb-4">User Gender Chart</h1>
    //   <Bar data={chartData} />
    // </div>
    "냐냐냥"
  );
}

export default UserGenderChart;
