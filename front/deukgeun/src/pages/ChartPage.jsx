import React, { useState } from "react";
import Layout from "../components/shared/Layout";
import Navbar from "../components/chart/Navbar";
import BarChart from "../components/chart/BarChart";
import DoughnutChart from "../components/chart/DoughnutChart";
import LineChart from "../components/chart/LineChart";

export default function ChartPage() {
  const [chartType, setChartType] = useState('bar');

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <LineChart />;
      case 'bar':
        return <BarChart />;
      case 'doughnut':
        return <DoughnutChart />;
      default:
        return <BarChart />;
    }
  };

  return (
    <Layout>
      <div>ChartPage</div>
      <Navbar setChartType={setChartType} />
      {renderChart()}
    </Layout>
  );
}
