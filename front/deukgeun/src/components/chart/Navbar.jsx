import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex flex-col p-4 bg-gray-800 text-white h-screen">
      <NavLink to="/stats/main" className="mb-4">Main</NavLink>
      <NavLink to="/stats/address" className="mb-4">Address</NavLink>
      <NavLink to="/stats/age" className="mb-4">Age</NavLink>
      <NavLink to="/stats/gender" className="mb-4">Gender</NavLink>
      <NavLink to="/stats/memberreason" className="mb-4">Member Reason</NavLink>
      <NavLink to="/stats/workoutduration" className="mb-4">Workout Duration</NavLink>
    </nav>
  );
};

export default Navbar;
