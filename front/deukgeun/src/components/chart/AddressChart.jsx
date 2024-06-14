import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

function AddressChart({ data }) {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example: Extracting data for AddressChart
        const labels = Object.keys(data);
        const values = Object.values(data);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Users by Address',
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
  }, [data]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">Address Chart</h1>
      <Doughnut data={chartData} />  {/* Doughnut chart rendering */}
    </div>
  );
}

export default AddressChart;
