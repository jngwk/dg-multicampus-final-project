import React, { useState, useEffect } from "react";
import MembershipChart1 from "../components/membership/MembershipChart1";
import MembershipTable from "../components/membership/Membership";
import { getMembershipStats } from "../api/membershipApi";
import Cookies from "js-cookie";

const MembershipStats = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getMembershipStats();
        console.log("Fetched data:", data); // Log fetched data
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats data:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="flex flex-col space-y-5 mt-10">
        <div className="flex flex-col w-[2000px] items-center justify-center min-h-screen">
          <h1>멤버십 페이지</h1>
          <div className="w-full max-w-full px-4 mb-8">
            <MembershipChart1 stats={stats} />
          </div>
          <div className="w-full max-w-full px-4 mb-8">
            <MembershipChart1 stats={stats} />
          </div>
          <div className="w-full max-w-full px-4">
            <MembershipTable stats={stats} />
          </div>
        </div>
      </div>
    </>
  );
};

export default MembershipStats;
