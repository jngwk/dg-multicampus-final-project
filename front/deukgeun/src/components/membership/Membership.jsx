import React from 'react';

const MembershipTable = ({ stats }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border-collapse shadow-md">
        <thead>
          <tr className="bg-gray-100">
            <th className="border-b border-gray-200 px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">등록 날짜</th>
            <th className="border-b border-gray-200 px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">만료 날짜</th>
            <th className="border-b border-gray-200 px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">멤버십 가입 이유</th>
            <th className="border-b border-gray-200 px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">성별</th>
            <th className="border-b border-gray-200 px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">나이</th>
            <th className="border-b border-gray-200 px-6 py-3 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">운동 시간</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {stats.map((membership, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border-b border-gray-200 px-6 py-4 whitespace-no-wrap">{membership.regDate}</td>
              <td className="border-b border-gray-200 px-6 py-4 whitespace-no-wrap">{membership.expDate}</td>
              <td className="border-b border-gray-200 px-6 py-4 whitespace-no-wrap">{membership.userMemberReason}</td>
              <td className="border-b border-gray-200 px-6 py-4 whitespace-no-wrap">{membership.userGender}</td>
              <td className="border-b border-gray-200 px-6 py-4 whitespace-no-wrap">{membership.userAge}</td>
              <td className="border-b border-gray-200 px-6 py-4 whitespace-no-wrap">{membership.userWorkoutDuration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MembershipTable;
