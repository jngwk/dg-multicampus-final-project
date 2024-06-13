import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getMembershipStats } from '../../api/chartApi';
import { useAuth } from '../../context/AuthContext';

const UserAgeChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMembershipStats(user.token);
      const ages = result.map(item => item.userAge);
      const ageCount = ages.reduce((acc, age) => {
        acc[age] = (acc[age] || 0) + 1;
        return acc;
      }, {});

      const chartData = {
        labels: Object.keys(ageCount),
        datasets: [
          {
            label: 'User Ages',
            data: Object.values(ageCount),
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
          },
        ],
      };
      setData(chartData);
    };
    fetchData();
  }, [user.token]);

  return data ? <Bar data={data} /> : <p>Loading...</p>;
};

export default UserAgeChart;
