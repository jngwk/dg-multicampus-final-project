import React, { useState } from 'react';
import logo from './logo.svg';
import Navbar from './component/Navbar';
import LineChart from './component/LineChart';
import BarChart from './component/BarChart';
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
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <Navbar setChartType={setChartType} />
        <h1>Chart Example</h1>
        {renderChart()}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
