import React, { useEffect, useState, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import { getChart } from '../../api/chartApi';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

function LineChart() {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getChart();
        const labels = data.map(point => point.label);
        const values = data.map(point => point.value);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Sample Data',
              data: values,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
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
    <div className="ChartPage">
      <h1>LineChart</h1>
      <Line ref={chartRef} data={chartData} />
    </div>
  );
}

export default LineChart;
