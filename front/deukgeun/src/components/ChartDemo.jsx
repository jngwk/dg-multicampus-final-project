import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const ChartDemo = () => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [dataPoints, setDataPoints] = useState(15); // Initial data points count

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const createInitialData = () => {
      const labels = [];
      const data = [];
      for (let i = 1; i <= 15; i++) {
        labels.push(`${i}일`);
        data.push(Math.floor(Math.random() * 100));
      }
      return { labels, data };
    };

    const initialData = createInitialData();

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: initialData.labels,
        datasets: [
          {
            label: "일별 방문자 수",
            data: initialData.data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    const interval = setInterval(() => {
      setDataPoints((prev) => (prev < 30 ? prev + 1 : 15)); // Restart to 15 when it hits 30
    }, 1500);

    return () => {
      clearInterval(interval);
      chartInstance.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (chartInstance.current) {
      if (dataPoints === 15) {
        // Reset chart data
        chartInstance.current.data.labels = [];
        chartInstance.current.data.datasets[0].data = [];
        for (let i = 1; i <= 15; i++) {
          chartInstance.current.data.labels.push(`${i}일`);
          chartInstance.current.data.datasets[0].data.push(
            Math.floor(Math.random() * 100)
          );
        }
      } else {
        const newLabel = `${dataPoints}일`;
        const newData = Math.floor(Math.random() * 100);

        chartInstance.current.data.labels.push(newLabel);
        chartInstance.current.data.datasets[0].data.push(newData);
      }

      chartInstance.current.update();
    }
  }, [dataPoints]);

  return (
    <div className="relative w-full h-full">
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartDemo;
