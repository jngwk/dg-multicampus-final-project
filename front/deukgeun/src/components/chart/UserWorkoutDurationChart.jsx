import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getMembershipStats } from '../../api/chartApi';
import { useAuth } from '../../context/AuthContext';

const UserWorkoutDurationChart = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMembershipStats(user.token);
        const durations = result.map(item => item.userWorkoutDuration);
        const durationCount = durations.reduce((acc, duration) => {
          acc[duration] = (acc[duration] || 0) + 1;
          return acc;
        }, {});

        const chartData = {
          labels: Object.keys(durationCount),
          datasets: [
            {
              label: 'User Workout Duration',
              data: Object.values(durationCount),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
          ],
        };
        setData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [user.token]);

  return data ? <Bar data={data} /> : <p>Loading...</p>;
};

export default UserWorkoutDurationChart;
