import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';
import 'chart.js/auto';

function DoughnutChart() {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8282/charts/data`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Fetched data:', data);
        const labels = data.map(point => point.label);
        const values = data.map(point => point.value);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: 'Sample Data',
              data: values,
              backgroundColor: [
                'rgba(75,192,192,0.2)',
                'rgba(255,99,132,0.2)',
                'rgba(54,162,235,0.2)',
                'rgba(255,206,86,0.2)',
              ],
              borderColor: [
                'rgba(75,192,192,1)',
                'rgba(255,99,132,1)',
                'rgba(54,162,235,1)',
                'rgba(255,206,86,1)',
              ],
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="ChartPage">
      <h1>DoughnutChart</h1>
      <Doughnut data={chartData} />
    </div>
  );
}

export default DoughnutChart;
