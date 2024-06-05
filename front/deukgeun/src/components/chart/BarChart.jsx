import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { getChart } from '../../api/chartApi';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Chart.js 요소 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function BarChart() {
  const chartRef = useRef(null);  // chartRef를 통해 차트 인스턴스 참조
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

    return () => {
      if (chartRef.current) {
        let chartStatus = ChartJS.getChart(chartRef.current); // 차트 인스턴스 가져오기
        if (chartStatus !== undefined) {
          chartStatus.destroy(); // 차트 인스턴스 파괴
        }
      }
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <h1 className="text-xl font-bold mb-4">BarChart</h1>
      <Bar ref={chartRef} data={chartData} />  {/* 라인 차트 렌더링 */}
    </div>
  );
}

export default BarChart;
