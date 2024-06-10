import React from "react";
import Layout from "../components/shared/Layout";
import BarChart from "../components/chart/BarChart";
import DoughnutChart from "../components/chart/DoughnutChart";
import LineChart from "../components/chart/LineChart";

export default function ChartPage() {
  return (
    <Layout>
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-5">ChartPage</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow"><LineChart /></div>
          <div className="bg-white p-4 rounded shadow"><BarChart /></div>
          <div className="bg-white p-4 rounded shadow"><DoughnutChart /></div>
          <div className="bg-white p-4 rounded shadow"> {/* Optional fourth chart or leave empty */}</div>
        </div>
      </div>
    </Layout>
  );
}