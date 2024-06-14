import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MembershipList = ({ gymId }) => {
  const [memberships, setMemberships] = useState([]);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await axios.get(`/api/membership/list/${gymId}`);
        setMemberships(response.data);
      } catch (error) {
        console.error('Error fetching membership list:', error);
      }
    };

    fetchMemberships();
  }, [gymId]);

  return (
    <div className="membership-list">
      <h2>All Members in Gym</h2>
      <ul>
        {memberships.map((membership) => (
          <li key={membership.membershipId}>
            {membership.user.userNickname} - {membership.user.userEmail}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MembershipList;
