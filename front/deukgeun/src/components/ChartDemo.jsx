import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const ChartDemo = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Generate dummy data
    const labels = [];
    const data = [];
    for (let i = 1; i <= 30; i++) {
      labels.push(`${i}일`);
      data.push(Math.floor(Math.random() * 100));
    }

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "일별 방문자 수",
            data: data,
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

    return () => {
      chart.destroy();
    };
  }, []);

  return (
    <div className="relative w-full h-full">
      <canvas ref={chartRef} />
    </div>
  );
};

export default ChartDemo;
