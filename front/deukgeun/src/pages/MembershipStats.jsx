import React, { useEffect, useState } from 'react';
import { getMembershipStats } from '../api/membershipApi';
import ChartSection from '../components/ChartSection';
import MembershipList from '../components/MembershipList';

const MembershipStats = () => {
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    const fetchStatsData = async () => {
      try {
        const data = await getMembershipStats();
        setStatsData(data);
      } catch (error) {
        console.error('Error fetching membership stats:', error);
      }
    };

    fetchStatsData();
  }, []);

  return (
    <div className="membership-stats">
      <h1>Membership Statistics</h1>
      {statsData && (
        <>
          <ChartSection statsData={statsData} />
          <MembershipList gymId={statsData.gymId} />
        </>
      )}
    </div>
  );
};

export default MembershipStats;
