import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { getMembershipStats } from '../../api/chartApi';
import { useAuth } from '../../context/AuthContext';

const AddressChart = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMembershipStats(user.token);
        const addressCounts = data.reduce((acc, item) => {
          acc[item.user.address] = (acc[item.user.address] || 0) + 1;
          return acc;
        }, {});

        setChartData({
          labels: Object.keys(addressCounts),
          datasets: [
            {
              label: 'Addresses',
              data: Object.values(addressCounts),
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user.token]);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Address Chart</h1>
      <Bar data={chartData} />
    </div>
  );
};

export default AddressChart;
