import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getMembershipStats } from '../../api/chartApi';
import { useAuth } from '../../context/AuthContext';

const UserGenderChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMembershipStats(user.token);
      const genders = result.map(item => item.userGender);
      const genderCount = genders.reduce((acc, gender) => {
        acc[gender] = (acc[gender] || 0) + 1;
        return acc;
      }, {});

      const chartData = {
        labels: Object.keys(genderCount),
        datasets: [
          {
            label: 'User Genders',
            data: Object.values(genderCount),
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
          },
        ],
      };
      setData(chartData);
    };
    fetchData();
  }, [user]);

  return data ? <Bar data={data} /> : <p>Loading...</p>;
};

export default UserGenderChart;
