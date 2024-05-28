import React, { useState } from 'react';
import Navbar from './component/Navbar';
import LineChart from './component/LineChart';
import BarChart from './component/Barchart';
import DoughnutChart from './component/DoughnutChart';

function App() {
  const [chartType, setChartType] = useState('line');

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return <LineChart />;
      case 'bar':
        return <BarChart />;
      case 'doughnut':
        return <DoughnutChart />;
      default:
        return <LineChart />;
    }
  };

  return (
    <div className="App">
      <Navbar setChartType={setChartType} />
      <h1>Chart Example</h1>
      {renderChart()}
    </div>
  );
}

export default App;
