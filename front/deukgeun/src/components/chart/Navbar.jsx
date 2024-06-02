import React from 'react';

const Navbar = ({ setChartType }) => {
  return (
    <nav>
      <button onClick={() => setChartType('line')}>Line Chart</button>
      <button onClick={() => setChartType('bar')}>Bar Chart</button>
      <button onClick={() => setChartType('doughnut')}>Doughnut Chart</button>
    </nav>
  );
};

export default Navbar;
