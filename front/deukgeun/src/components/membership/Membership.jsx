import React, { useState } from "react";

const MembershipTable = ({ stats, filterType, start, end }) => {
  const filteredStats = stats.filter(stat => {
    const statDate = new Date(stat.regDate);
    return statDate >= new Date(start) && statDate <= new Date(end) &&
           (filterType === '전체' || stat.userGender === filterType);
  });

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">등록 날짜</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">만료 날짜</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">성별</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">나이</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">운동 경력</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입 이유</th>
          </tr>
        </thead>
        <tbody>
          {filteredStats.map((stat, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.regDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.expDate}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.userGender}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.userAge}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.userWorkoutDuration}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.userMemberReason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembershipTable;