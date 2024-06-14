import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getMembershipStats } from '../../api/chartApi';
import { useAuth } from '../../context/AuthContext';

const UserMemberReasonChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const result = await getMembershipStats(user.token);
      const reasons = result.map(item => item.userMemberReason);
      const reasonCount = reasons.reduce((acc, reason) => {
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
      }, {});

      const chartData = {
        labels: Object.keys(reasonCount),
        datasets: [
          {
            label: 'User Member Reasons',
            data: Object.values(reasonCount),
            backgroundColor: 'rgba(255, 206, 86, 0.6)',
          },
        ],
      };
      setData(chartData);
    };
    fetchData();
  }, [user]);

  return data ? <Bar data={data} /> : <p>Loading...</p>;
};

export default UserMemberReasonChart;
