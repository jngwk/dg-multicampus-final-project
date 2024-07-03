import React from "react";

const MembershipTable = ({ stats }) => {
  const tableHeader = (
    <thead>
      <tr className="bg-grayish-red bg-opacity-35">
        <th className="text-center px-6 py-3 text-xs leading-4 font-semibold text-gray-600 uppercase tracking-wider rounded-l-lg w-1/6">
          등록 날짜
        </th>
        <th className="px-6 py-3 text-center text-xs leading-4 font-semibold text-gray-600 uppercase tracking-wider w-1/6">
          만료 날짜
        </th>
        <th className="px-6 py-3 text-center text-xs leading-4 font-semibold text-gray-600 uppercase tracking-wider w-1/6">
          멤버십 가입 이유
        </th>
        <th className="px-6 py-3 text-center text-xs leading-4 font-semibold text-gray-600 uppercase tracking-wider w-1/6">
          성별
        </th>
        <th className="px-6 py-3 text-center text-xs leading-4 font-semibold text-gray-600 uppercase tracking-wider w-1/6">
          나이
        </th>
        <th className="px-6 py-3 text-center text-xs leading-4 font-semibold text-gray-600 uppercase tracking-wider rounded-r-lg w-1/6">
          운동 경력
        </th>
      </tr>
    </thead>
  );

  const tableBody = (
    <tbody>
      {stats.map((membership, index) => (
        <tr key={index} className="bg-gray-50 hover:bg-grayish-red hover:bg-opacity-10">
          <td className="px-6 py-3 text-center text-sm whitespace-no-wrap rounded-l-lg border-t-2 border-white w-1/6">
            {membership.regDate} 
          </td>
          <td className="px-6 py-3 text-center text-sm whitespace-no-wrap border-t-2 border-white w-1/6">
            {membership.expDate}
          </td>
          <td className="px-6 py-3 text-center text-sm whitespace-no-wrap border-t-2 border-white w-1/6">
            {membership.userMemberReason}
          </td>
          <td className="px-6 py-3 text-center text-sm whitespace-no-wrap border-t-2 border-white w-1/6">
            {membership.userGender}
          </td>
          <td className="px-6 py-3 text-center text-sm whitespace-no-wrap border-t-2 border-white w-1/6">
            {membership.userAge}
          </td>
          <td className="px-6 py-3 text-center text-sm whitespace-no-wrap rounded-r-lg border-t-2 border-white w-1/6">
            {membership.userWorkoutDuration}
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="overflow-x-auto">
      <div className="mb-4">
        <table className="min-w-full border-collapse shadow-md">
          {tableHeader}
        </table>
        <div className="max-h-[300px] overflow-y-auto scrollbar-hide">
          <table className="min-w-full border-collapse shadow-md">
            {tableBody}
          </table>
        </div>
      </div>
    </div>
  );
};

export default MembershipTable;
