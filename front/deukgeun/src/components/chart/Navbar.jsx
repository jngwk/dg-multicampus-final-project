// Navbar.js

import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-center">
        <li className="mx-4">
          <NavLink to="/address" activeClassName="font-bold">
            Address
          </NavLink>
        </li>
        <li className="mx-4">
          <NavLink to="/age" activeClassName="font-bold">
            Age
          </NavLink>
        </li>
        <li className="mx-4">
          <NavLink to="/gender" activeClassName="font-bold">
            Gender
          </NavLink>
        </li>
        <li className="mx-4">
          <NavLink to="/memberreason" activeClassName="font-bold">
            Member Reason
          </NavLink>
        </li>
        <li className="mx-4">
          <NavLink to="/workoutduration" activeClassName="font-bold">
            Workout Duration
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
