import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AddressChart from '../components/chart/AddressChart';
import UserAgeChart from '../components/chart/UserAgeChart';
import UserGenderChart from '../components/chart/UserGenderChart';
import UserMemberReasonChart from '../components/chart/UserMemberReasonChart';
import UserWorkoutDurationChart from '../components/chart/UserWorkoutDurationChart';
import Navbar from '../components/chart/Navbar';
import { getMembershipStats } from '../api/chartApi';

const MainPage = ({ data }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <AddressChart data={data} />
    <UserAgeChart data={data} />
    <UserGenderChart data={data} />
    <UserMemberReasonChart data={data} />
    <UserWorkoutDurationChart data={data} />
  </div>
);

const ChartPage = ({ page }) => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getMembershipStats(user.token);
        setData(stats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (user && user.role === 'ROLE_GYM') {
      fetchData();
    } else {
      alert('권한이 없는 사용자 입니다.');
    }
  }, [user]);

  if (!data) return <div>Loading...</div>;

  return (
    <div className="flex">
      <Navbar />
      <div className="p-5 flex-grow">
        <h1 className="text-2xl font-bold mb-5">Chart Page</h1>
        {page === 'main' && <MainPage data={data} />}
        {page === 'address' && <AddressChart data={data} />}
        {page === 'age' && <UserAgeChart data={data} />}
        {page === 'gender' && <UserGenderChart data={data} />}
        {page === 'memberreason' && <UserMemberReasonChart data={data} />}
        {page === 'workoutduration' && <UserWorkoutDurationChart data={data} />}
      </div>
    </div>
  );
};

export default ChartPage;
